'use strict';

let cardsData = {};
const sets = ['Foundations', 'Rising Tides', 'Call of the Mountain', 'Empires of the Ascended', 'Beyond the Bandlewood', 'Worldwalker'];

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  })  
;

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
		}
		
		this.jsonsGotten = this.jsonsGotten.bind(this)
	}
	
	jsonsGotten(data) {
		cardsData = data;
		console.log(data)
		this.setState({
			loading: false
		})
	}

	componentDidMount() {
		Promise.all(sets.map((e, k) => 
			fetch('../lor-jsons/latest/set' + (k+1) + '-en_us/en_us/data/set' + (k+1) + '-en_us.json').then(response => response.json())
		)).then(this.jsonsGotten)
	}
	render() {
		if (this.state.loading)
			return null;
		return (
			<div id='quote-box'>
				;)
			</div>
		)
	}
}

const container = document.getElementById('app');
const root = ReactDOM.createRoot(container);
root.render(<App />);