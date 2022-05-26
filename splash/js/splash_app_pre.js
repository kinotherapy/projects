'use strict';

let cardsData = {};
let set = Math.floor(Math.random() * 5 + 1);
//console.log('set ' + set);
let jason = 'https://kinotherapy.github.io/jsons/set' + set + '-en_us.json';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			ft: '',
			img: ''
		}
		this.newCard = this.newCard.bind(this)
	}

	newCard() {
		console.log('new card')
		let card = cardsData[Math.floor(Math.random() * cardsData.length)];
		this.setState({
			name: card.name,
			ft: card.flavorText,
			img: card.cardCode
		})  
	}

	componentDidMount() {
		fetch(jason).then(response => response.json()).then(
			data => {
				cardsData = data;
				this.newCard()
			}
		)
	}
	render () {
		let twit = 'https://twitter.com/intent/tweet?hashtags=LegendsOfRuneterra&text=' + encodeURIComponent('my favourite card is ' + this.state.name + ' :}');
		//let imag = 'https://cdn-lor.mobalytics.gg/production/images/set' + set + '/en_us/img/card/game/' + this.state.img + '-full.png'
		let imag = 'https://dd.b.pvp.net/latest/set' + set + '/en_us/img/cards/' + this.state.img + '-full.png';
		console.log(twit)
		return (
			<div id='quote-box'>
				<div id='author'>
					{this.state.name.toUpperCase()}
				</div>
				<img id='image' src={imag} alt="Card Art" />
				<div id='text'>
					{this.state.ft}
				</div>
				<div id='footer'>
					<a onClick = {this.newCard} id='new-quote'>
						<i class="fa fa-rotate-right"/>
					</a>
					<div id='spacing' />
					<a href={twit} id='tweet-quote' target="_top"><i class="fa fa-twitter"/></a>
				</div>
			</div>
		)
	}
}

const container = document.getElementById('app');
const root = ReactDOM.createRoot(container);
root.render(<App />);