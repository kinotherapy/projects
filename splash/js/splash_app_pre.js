'use strict';

let cardsData = {};
let set = Math.floor(Math.random() * 5 + 1);
//console.log('set ' + set);
var jason = '../lor-jsons/latest/set' + set + '-en_us/en_us/data/set' + set + '-en_us.json';

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
			name: '',
			ft: '',
			img: ''
		}
		this.newCard = this.newCard.bind(this)
	}

	newCard() {
		this.setState({
			loading: true
		});
		console.log('new card')
		let card = cardsData[Math.floor(Math.random() * cardsData.length)];
		let imag = '../lor-jsons/latest/set' + set + '-en_us/en_us/img/cards/' + card.cardCode + '-full.png';
		console.log(imag);
		loadImage(imag).then(image => {
			console.log('loaded');
			this.setState({
				name: card.name,
				ft: card.flavorText,
				img: imag,
				loading: false
			}) 
			}
		); 
	}

	componentDidMount() {
		fetch(jason).then(response => response.json()).then(
			data => {
				cardsData = data;
				this.newCard()
			}
		)
	}
	render() {
		if (this.state.loading)
			return null;
		let twit = 'https://twitter.com/intent/tweet?hashtags=LegendsOfRuneterra&text=' + encodeURIComponent('my favourite card is ' + this.state.name + ' :}');
		//let imag = 'https://cdn-lor.mobalytics.gg/production/images/set' + set + '/en_us/img/card/game/' + this.state.img + '-full.png'
		console.log(twit)
		return (
			<div id='quote-box'>
				<div id='author'>
					{this.state.name.toUpperCase()}
				</div>
				<img id='image' src={this.state.img} alt="Card Art"  />
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