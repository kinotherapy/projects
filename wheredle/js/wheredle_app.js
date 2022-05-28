'use strict';

let gbData = [];
const MAX_GUESSES = 6;

class App extends React.Component {
	
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			playing: false,
			cityNameClean: '',
			cityName: [],
			guessNo: 0,
			selected: [0, 0],
			prevGuesses: {}
			
		}
		
		this.letterClick = this.letterClick.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}
	
	blankGuess(raw) {
		return raw.map(word => Array(word.length).fill(' '))
	}
	
	randomCity() {
		let city = gbData[Math.floor(Math.random() * gbData.length)];
		if (!(/ /.test(city.city))) {
			this.randomCity();
			return;
		}
		//city = {city: 'South North Hamptonshire'}
		let cityRaw = city.city.toUpperCase().split(/[ -]/);
		this.setState({
			cityNameClean: city.city,
			cityName: cityRaw,
			loading: false,
			playing: true,
			currentGuess: this.blankGuess(cityRaw)
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
		console.log('typing "' + letter + '" in (' + this.state.selected.join(', ') + ')');
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
		console.log('moving from (' + this.state.selected.join(', ') + ')');
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
		console.log('moved to (' + this.state.selected.join(', ') + ')');
	}
	
	makeGuess() {
		for (let i = 0; i < this.state.currentGuess.length; i++) {
			if (this.state.currentGuess[i].includes(' '))
				return;
		}
		let newGuess = this.state.currentGuess;
		//newGuess = newGuess.map((word, i) => (word.map((letter, j) => return [letter, state] )));
		newGuess = newGuess.map((word, i) => (word.map((letter, j) => {
			let state = 'letter-grey';
			if (this.state.cityName[i][j] == letter) {
				state = 'letter-green'
			} else if (this.state.cityName[i].includes(letter)) {
				state = 'letter-yellow'				
			} else if (this.state.cityName.join('').includes(letter)) {
				state = 'letter-blue'				
			}
			return [letter, state]
		})));
		this.setState(state => ({
			guessNo: state.guessNo + 1,
			prevGuesses: [...state.prevGuesses, newGuess],
			currentGuess: this.blankGuess(state.cityName),
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
		return (
			<div id='wrapper'>
				{ guessBox }
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
		let style = 'letter-not-yet'
		let ter = '';
		if (this.props.guessNo > this.props.no) {
			ter = this.props.prevGuesses[this.props.no][i][j][0];
			style = this.props.prevGuesses[this.props.no][i][j][1];
		} else if (this.props.guessNo == this.props.no) {
			ter = this.props.currentGuess[i][j];
			if (i == this.props.selected[0] && j == this.props.selected[1]) {
				style = 'letter-selected';
			} else if (ter != ' ') {
				style = 'letter-filled';
			}				
		}
		return <div key = {'letter ' + j} className = {'letter ' + style} onClick = {() => this.props.letterClick(this.props.no, i, j)}> {ter}  </div>
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