'use strict';

let gbData = [];
let city;

class App extends React.Component {
	
	constructor(props) {
		super(props)
		this.state = {
			message: 'hang on',
		}
	}
	
	randomCity() {
		city = gbData[Math.floor(Math.random() * gbData.length)];
		this.setState({
			message: city.city
		})
	}

	componentDidMount() {
		fetch('js/gb.json').then(response => { 
			console.log(response);
			return response.json();
		}).then(
			data => {
				gbData = data.filter(obj => !(/[^a-zA-Z -]/.test(obj.city)));
				this.randomCity();
			}
		)
	}
	
	render() {
		if (city == null)
			return null;
		return (
			<div id='wrapper'>
				{this.state.message}
			</div>
		)
	}
}

const container = document.getElementById('app');
const root = ReactDOM.createRoot(container);
root.render(<App />);