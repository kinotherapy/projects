'use strict';

let gbData = [];

class App extends React.Component {
	
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			playing: false,
			cityNameClean: '',
			cityName: [],
			guessNo: 2,
			selected: [0, 0],
			prevGuesses: {}
			
		}
		
		this.letterClick = this.letterClick.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}
	
	blankGuess() {
		
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
			currentGuess: cityRaw.map(word => Array(word.length).fill(' '))
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
		this.advanceSelection();
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
	
	devanceSelection() {
		if (this.state.selected[1] == 0) {
			if (this.state.selected[0] == 0)
				return;
			this.setState((state) => ({
				selected: [state.selected[0] - 1, this.state.cityName[state.selected[0] - 1].length - 1]
			}));
		} else {
			this.setState((state) => ({
				selected: [state.selected[0], state.selected[1] - 1]
			}));
		}
	}
	
	handleKeyPress(e) {
		if (this.state.playing) {
			switch (true) {
				case (e.keyCode == 39):
					this.advanceSelection();
					break;
				case (e.keyCode == 37):
					this.devanceSelection();
					break;
				case (e.keyCode >= 65 && e.keyCode <= 90):
					this.typeLetter(String.fromCharCode(e.keyCode));
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
		for (let k = 0; k < 6; k++)
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
			style = 'letter-previous';
			ter = letter;
		} else if (this.props.guessNo == this.props.no) {
			if (i == this.props.selected[0] && j == this.props.selected[1]) {
				ter = this.props.currentGuess[this.props.selected[0]][this.props.selected[1]];
				style = 'letter-selected';
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

/*class Letter extends React.Component {
	
	constructor(props) {
		super(props)
		this.state = {
		}
	}
	
	render() {
		return (
			<div className = {'letter ' + this.props.style}>
				{this.props.letterSingle}
			</div>
		)
	}
}*/

const container = document.getElementById('app');
const root = ReactDOM.createRoot(container);
root.render(<App />);