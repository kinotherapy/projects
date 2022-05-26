'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cardsData = {};
var set = Math.floor(Math.random() * 5 + 1);
//console.log('set ' + set);
var jason = 'https://kinotherapy.github.io/jsons/set' + set + '-en_us.json';

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.state = {
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
      console.log('new card');
      var card = cardsData[Math.floor(Math.random() * cardsData.length)];
      this.setState({
        name: card.name,
        ft: card.flavorText,
        img: card.cardCode
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      fetch(jason).then(function (response) {
        return response.json();
      }).then(function (data) {
        cardsData = data;
        _this2.newCard();
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var twit = 'https://twitter.com/intent/tweet?hashtags=LegendsOfRuneterra&text=' + encodeURIComponent('my favourite card is ' + this.state.name + ' :}');
      //var imag = 'https://cdn-lor.mobalytics.gg/production/images/set' + set + '/en_us/img/card/game/' + this.state.img + '-full.png';
      var imag = 'https://dd.b.pvp.net/latest/set' + set + '/en_us/img/cards/' + this.state.img + '-full.png';
      console.log(twit);
      return React.createElement(
        'div',
        { id: 'quote-box' },
        React.createElement(
          'div',
          { id: 'author' },
          this.state.name.toUpperCase()
        ),
        React.createElement('img', { id: 'image', src: imag, alt: 'Card Art' }),
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