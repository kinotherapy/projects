'use strict';

let cardsData = [];
let artists = {}
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
	
	unRiotWording(name) {
		switch (name) {
			case 'Kudos Illustrations':
			case 'Kudos Production':
			case 'Kudos Productions ':
				return 'Kudos Productions';
			case 'Wild Blue':
			case 'Wild Blue Studios':
				return 'Wild Blue Studio';
			case 'MICHAEL IVAN':
			case 'Michal Ivan':
				return 'Michael Ivan';
			case 'Jihun Lee':
				return 'JiHun Lee';
			case 'Polar Engine Studio':
				return 'Polar Engine';
			case '':
				return 'Unknown';
			default:
				return name;
		}
	}
	
	jsonsGotten(jsons) {
		cardsData = jsons.reduce((p,c) => [...p, ...c], []);
		for (let i = 0; i < cardsData.length; i++) {
			let card = cardsData[i];
			/*let fap = card.assets[0].fullAbsolutePath
			if (fap.substring(fap.length - card.cardCode.length - 9, fap.length - 9) != card.cardCode) {
				console.log(fap.length);
				console.log(card.cardCode);
				console.log(fap.substring(fap.length - card.cardCode.length - 9, fap.length - 9));
			}*/
			let artist = this.unRiotWording(card.artistName)
			if (!artists.hasOwnProperty(artist)) artists[artist] = [];
			artists[artist].push([card.name, card]);
		}
		artists = Object.entries(artists).sort((a,b) => (a[1].length < b[1].length));
		console.log(artists);
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