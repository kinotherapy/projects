'use strict';

let gbData = [];
const MAX_GUESSES = 6;
const KEYBOARD = [['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'], ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'], ['Z', 'X', 'C', 'V', 'B', 'N', 'M']];
const WARMER = ['green', 'yellow', 'blue', 'grey'];

class App extends React.Component {
	
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			playing: false,
			cityInFull: {},
			cityName: [],
			currentGuess: [],
			guessNo: 0,
			selected: [0, 0],
			prevGuesses: [],
			knowledge: {}
		}
		
		this.letterClick = this.letterClick.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}
	
	blankGuess(raw) {
		return raw.map(word => Array(word.length).fill(' '))
	}
	
	randomCity() {
		let city = gbData[Math.floor(Math.random() * gbData.length)];
		/*if (!(/ /.test(city.city))) {
			this.randomCity();
			return;
		}*/
		//city = {city: 'South North Hamptonshire'}
		let cityRaw = city.city.toUpperCase().split(/[ -]/);
		this.setState({
			cityInFull: city,
			cityName: cityRaw,
			loading: false,
			playing: true,
			currentGuess: this.blankGuess(cityRaw),
			guessNo: 0,
			selected: [0, 0],
			prevGuesses: [],
			knowledge: {}
		})
	}
	
	letterClick(no, i, j) {
		console.log('(' + no + ', ' + i + ', ' + j + ') clicked');
		if (no == this.state.guessNo && this.state.playing) {
			this.setState({
				selected: [i, j]
			});
		}
	}
	
	typeLetter(letter) {
		let newGuess = this.state.currentGuess;
		newGuess[this.state.selected[0]][this.state.selected[1]] = letter;
		this.setState({
			currentGuess: newGuess
		});
	}
	
	advanceSelection() {
		if (this.state.selected[1] + 1 == this.state.cityName[this.state.selected[0]].length) {
			if (this.state.selected[0] + 1 == this.state.cityName.length)
				return;
			this.setState((state) => ({
				selected: [state.selected[0] + 1, 0]
			}));
		} else {
			this.setState((state) => ({
				selected: [state.selected[0], state.selected[1] + 1]
			}));
		}
	}
	
	devanceSelection(backspace) {
		if (this.state.selected[1] == 0) {
			if (this.state.selected[0] == 0)
				return;
			this.setState((state) => ({
				selected: [state.selected[0] - 1, this.state.cityName[state.selected[0] - 1].length - 1]
			}), () => { if (backspace) this.typeLetter(' ') });
		} else {
			this.setState((state) => ({
				selected: [state.selected[0], state.selected[1] - 1]
			}), () => { if (backspace) this.typeLetter(' ') });
		}
	}
	
	win() {
		this.setState({
			playing: false
		})
	}
	
	lose() {
		this.setState({
			playing: false
		})
	}
	
	makeGuess() {
		for (let i = 0; i < this.state.currentGuess.length; i++) {
			if (this.state.currentGuess[i].includes(' '))
				return;
		}
		let victory = true;
		let newGuess = this.state.currentGuess.map((word, i) => (word.map((letter, j) => {
			if (this.state.cityName[i][j] == letter) {
				return [letter, WARMER[0], false] 
			} else {
				victory = false;
				return [letter, WARMER[3], true]
			}
		})));
		if (victory)
			this.win();
		else if (this.state.guessNo == 5)
			this.lose();
		else {
			for (let i = 0; i < newGuess.length; i++) {
				for (let j = 0; j < newGuess[i].length; j++) {
					let letter = newGuess[i][j];
					if (letter[1] == WARMER[3]) {
						let check = -1;
						for (let k = 0; (k < newGuess[i].length) && check == -1; k++) {
							if (this.state.cityName[i][k][0] == letter[0] && newGuess[i][k][2])
								check = k;
						}
						if (check != -1) {
							letter[1] = WARMER[1];
							newGuess[i][check][2] = false;
						}
					}
				}
			}
			for (let i = 0; i < newGuess.length; i++) {
				for (let j = 0; j < newGuess[i].length; j++) {
					let letter = newGuess[i][j];
					if (letter[1] == WARMER[3]) {
						let check = [-1, -1];
						for (let l = 0; (l < newGuess.length) && check[0] == -1; l++) {
							if (l != i) {
								for (let k = 0; (k < newGuess[l].length) && check[0] == -1; k++) {
									if (this.state.cityName[l][k][0] == letter[0] && newGuess[l][k][2])
										check = [l, k];
								}
							}
						}
						if (check[0] != -1) {
							letter[1] = WARMER[2];
							newGuess[check[0]][check[1]][2] = false;
						}
					}
				}
			}
		}
		let know = {...this.state.knowledge};
		for (let i = 0; i < newGuess.length; i++) {
			for (let j = 0; j < newGuess[i].length; j++) {
				let ter = newGuess[i][j];
				if (!know.hasOwnProperty(ter[0]) || (know[ter[0]] > WARMER.indexOf(ter[1]))) {
					know[ter[0]] = WARMER.indexOf(ter[1]);
				}
			}
		}
		this.setState(state => ({
			guessNo: state.guessNo + 1,
			prevGuesses: [...state.prevGuesses, newGuess],
			currentGuess: this.blankGuess(state.cityName),
			knowledge: know,
			selected: [0, 0]
		}))
	}
	
	handleKeyPress(e) {
		if (this.state.playing) {
			switch (true) {
				case (e.keyCode == 39):
					this.advanceSelection();
					break;
				case (e.keyCode == 37):
					this.devanceSelection(false);
					break;
				case (e.keyCode >= 65 && e.keyCode <= 90):
					this.typeLetter(String.fromCharCode(e.keyCode));
					this.advanceSelection();
					break;
				case (e.keyCode == 32):
					this.typeLetter(' ');
					this.advanceSelection();
					break;
				case (e.keyCode == 46):
					this.typeLetter(' ');
					break;
				case (e.keyCode == 8):
					if (this.state.currentGuess[this.state.selected[0]][this.state.selected[1]] == ' ') {
						this.devanceSelection(true);
						this.typeLetter(' ');
					} else {
						this.typeLetter(' ');
						this.devanceSelection(false);						
					}
					break;
				case (e.keyCode == 13):
					if (this.state.guessNo < MAX_GUESSES)
						this.makeGuess();
					break;
				default:
					console.log(e.keyCode)
					break;
			}
		} else if (!this.state.loading) {
			this.randomCity();
		}
	}

	componentDidMount() {
		fetch('js/gb.json').then(response => { 
			console.log(response);
			return response.json();
		}).then(
			data => {
				gbData = data.filter(obj => !(/[^a-zA-Z -]/.test(obj.city)));
				document.addEventListener("keydown", this.handleKeyPress);
				this.randomCity();
			}
		)
	}
	
	componentWillUnmount() {
		console.log('?');
		document.removeEventListener("keydown", this.handleKeyPress);
	}
	
	render() {
		if (this.state.loading)
			return null;
		let guessBox = [];
		for (let k = 0; k < MAX_GUESSES; k++)
			guessBox.push(<Guess key = {'guess ' + k} no = {k} {...this.state} letterClick = {this.letterClick} />)
		let keyBox = [];
		if (this.state.playing) {
			for (let k = 0; k < KEYBOARD.length; k++)
				keyBox.push(KEYBOARD[k].map((letter, i) => <div key = {'key ' + KEYBOARD[k][i]}> {KEYBOARD[k][i]} </div> ))
			keyBox = KEYBOARD.map((row, j) => row.map(
				(letter, i) => <div key = {'key ' + letter} className = { 'key-button key-' + ((this.state.knowledge.hasOwnProperty(letter)) ? (WARMER[this.state.knowledge[letter]]) : 'unknown') }
				onClick = {() => { this.typeLetter(letter); this.advanceSelection() }}> {letter} </div>
			));
			keyBox[2].unshift(<div key = 'enter' className = 'key-button key-enter' onClick = {() => { this.handleKeyPress({keyCode: 13}) }}> <i className="fa fa-sign-in"/></div>);
			keyBox[2].push(<div key = 'backspace' className = 'key-button key-backspace' onClick = {() => { this.handleKeyPress({keyCode: 8}) }}> <i className="fa fa-arrow-left"/></div>);
			keyBox = keyBox.map((row, i) => <div key = {'row + ' + i} className = 'keyboard-row'>{row}</div>);
		} else {
			keyBox = [
				<h1 className = 'plaintext' key = 'h1'>{this.state.cityInFull.city + ', ' + this.state.cityInFull.admin_name}</h1>,
				<h3 className = 'plaintext' key='h3'>{(this.state.guessNo == 6) ? '(you didn\'t get it lol)' : '(you got it in ' + this.state.guessNo + ' guesses)'}</h3>,
				<h2 className = 'plaintext' key='h2'>press any key to play again</h2>
			]
		}
		return (
			<div id='wrapper'>
				{ guessBox }
				<div id='keyboard'>
					{ keyBox }
				</div>
			</div>
		)
	}
}

class Guess extends React.Component {
	
	constructor(props) {
		super(props)
		this.state = {
		}
	}
	
	letterStyling(word, i, letter, j) {
		let style = 'empty'
		let ter = '';
		if (this.props.guessNo > this.props.no) {
			ter = this.props.prevGuesses[this.props.no][i][j][0];
			style = this.props.prevGuesses[this.props.no][i][j][1];
		} else if (this.props.guessNo == this.props.no) {
			ter = this.props.currentGuess[i][j];
			if ((this.props.playing) && (i == this.props.selected[0]) && (j == this.props.selected[1])) {
				style = 'selected';
			} else if (ter != ' ') {
				style = 'filled';
			}				
		}
		return <div key = {'letter ' + j} className = {'letter letter-' + style} onClick = {() => this.props.letterClick(this.props.no, i, j)}> {ter}  </div>
	}
	
	wordToLetters(word, i) {
		let ters = word.split('').map((letter, j) => this.letterStyling(word, i, letter, j));
		return (i == 0) ? ters :
		(<React.Fragment key = {'fragment ' + i}>
			<div className = 'space' key = {'space ' + i}></div>
			{ ters } 
		</React.Fragment>);
		
	}
	
	render() {
		let str = this.props.cityName.map((word, i) => this.wordToLetters(word, i));
		return (
			<div className = 'guess'>
				{str}
			</div>
		)
	}
	
}

const container = document.getElementById('app');
const root = ReactDOM.createRoot(container);
root.render(<App />);