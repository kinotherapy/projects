'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cardsData = {};
var set = Math.floor(Math.random() * 5 + 1);
//console.log('set ' + set);
var jason = '../lor-jsons/latest/set' + set + '-en_us/en_us/data/set' + set + '-en_us.json';

var loadImage = function loadImage(src) {
	return new Promise(function (resolve, reject) {
		var img = new Image();
		img.onload = function () {
			return resolve(img);
		};
		img.onerror = reject;
		img.src = src;
	});
};

var App = function (_React$Component) {
	_inherits(App, _React$Component);

	function App(props) {
		_classCallCheck(this, App);

		var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

		_this.state = {
			loading: true,
			name: '',
			ft: '',
			img: ''
		};
		_this.newCard = _this.newCard.bind(_this);
		return _this;
	}

	_createClass(App, [{
		key: 'newCard',
		value: function newCard() {
			var _this2 = this;

			this.setState({
				loading: true
			});
			console.log('new card');
			var card = cardsData[Math.floor(Math.random() * cardsData.length)];
			var imag = '../lor-jsons/latest/set' + set + '-en_us/en_us/img/cards/' + card.cardCode + '-full.png';
			console.log(imag);
			loadImage(imag).then(function (image) {
				console.log('loaded');
				_this2.setState({
					name: card.name,
					ft: card.flavorText,
					img: imag,
					loading: false
				});
			});
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this3 = this;

			fetch(jason).then(function (response) {
				return response.json();
			}).then(function (data) {
				cardsData = data;
				_this3.newCard();
			});
		}
	}, {
		key: 'render',
		value: function render() {
			if (this.state.loading) return null;
			var twit = 'https://twitter.com/intent/tweet?hashtags=LegendsOfRuneterra&text=' + encodeURIComponent('my favourite card is ' + this.state.name + ' :}');
			//let imag = 'https://cdn-lor.mobalytics.gg/production/images/set' + set + '/en_us/img/card/game/' + this.state.img + '-full.png'
			console.log(twit);
			return React.createElement(
				'div',
				{ id: 'quote-box' },
				React.createElement(
					'div',
					{ id: 'author' },
					this.state.name.toUpperCase()
				),
				React.createElement('img', { id: 'image', src: this.state.img, alt: 'Card Art' }),
				React.createElement(
					'div',
					{ id: 'text' },
					this.state.ft
				),
				React.createElement(
					'div',
					{ id: 'footer' },
					React.createElement(
						'a',
						{ onClick: this.newCard, id: 'new-quote' },
						React.createElement('i', { 'class': 'fa fa-rotate-right' })
					),
					React.createElement('div', { id: 'spacing' }),
					React.createElement(
						'a',
						{ href: twit, id: 'tweet-quote', target: '_top' },
						React.createElement('i', { 'class': 'fa fa-twitter' })
					)
				)
			);
		}
	}]);

	return App;
}(React.Component);

var container = document.getElementById('app');
var root = ReactDOM.createRoot(container);
root.render(React.createElement(App, null));