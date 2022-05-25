'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var time = 0;
var interval = void 0;
var MILIMINS = 60000;
var alarm = 'https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav';

var App = function (_React$Component) {
	_inherits(App, _React$Component);

	function App(props) {
		_classCallCheck(this, App);

		var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

		_this.mmss = function (n) {
			return n < 10 ? '0' + n : n.toString();
		};

		_this.state = {
			break: 5,
			session: 25,
			breaking: false,
			status: 'stopped',
			remaining: 0
		};
		_this.adjust = _this.adjust.bind(_this);
		_this.reset = _this.reset.bind(_this);
		_this.startstop = _this.startstop.bind(_this);
		_this.updateTime = _this.updateTime.bind(_this);
		return _this;
	}

	_createClass(App, [{
		key: 'adjust',
		value: function adjust(sect, summand) {
			this.setState(function (state) {
				var obj = {};
				obj[sect] = Math.min(Math.max(state[sect] + summand, 1), 60);
				return obj;
			});
		}
	}, {
		key: 'reset',
		value: function reset() {
			this.pleaseStop();
			this.setState({
				break: 5,
				session: 25,
				breaking: false,
				status: 'stopped',
				remaining: 0
			});
			document.getElementById('beep').pause();
			document.getElementById('beep').currentTime = 0;
		}
	}, {
		key: 'updateTime',
		value: function updateTime() {
			var swtch = false;
			if (this.state.remaining <= 0) {
				document.getElementById('beep').play();
				this.setState(function (state) {
					return {
						remaining: state[state.breaking ? 'session' : 'break'] * 60,
						breaking: !state.breaking
					};
				});
			} else {
				this.setState(function (state) {
					return {
						remaining: state.remaining - 1,
						breaking: state.breaking
					};
				});
			}
		}
	}, {
		key: 'pleaseStop',
		value: function pleaseStop() {
			if (interval != null) {
				clearInterval(interval);
			}
		}
	}, {
		key: 'startstop',
		value: function startstop() {
			switch (this.state.status) {
				case 'running':
					this.pleaseStop();
					this.setState({
						status: 'paused'
					});
					break;
				case 'stopped':
					var remain = this.state.session * 60;
					interval = setInterval(this.updateTime, 1000);
					this.setState({
						status: 'running',
						remaining: remain
					});
					break;
				default:
					interval = setInterval(this.updateTime, 1000);
					this.setState({
						status: 'running'
					});
					break;
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var qtime = this.state.session + ':00';
			if (this.state.status != 'stopped') {
				var seconds = Math.ceil(this.state.remaining);
				var minutes = Math.floor(seconds / 60);
				var aSeconds = (seconds % 60).toString();
				qtime = this.mmss(minutes) + ':' + this.mmss(aSeconds);
			} else {
				qtime = qtime.length < 5 ? '0' + qtime : qtime;
			}
			return React.createElement(
				'div',
				{ id: 'wrapper' },
				React.createElement(
					'div',
					{ id: 'controls-section' },
					React.createElement(Panel, { label: 'break', value: this.state.break, adjust: this.adjust }),
					React.createElement(Panel, { label: 'session', value: this.state.session, adjust: this.adjust })
				),
				React.createElement(
					'div',
					{ id: 'display' },
					React.createElement(
						'div',
						{ id: 'timer-label' },
						this.state.breaking ? 'Break' : 'Session'
					),
					React.createElement(
						'div',
						{ id: 'time-left' },
						qtime
					),
					React.createElement(
						'div',
						{ id: 'playback' },
						React.createElement(
							'button',
							{ id: 'start_stop', onClick: this.startstop },
							React.createElement('i', { className: this.state.status == 'running' ? "fa fa-pause" : "fa fa-play" })
						),
						React.createElement(
							'button',
							{ id: 'reset', onClick: this.reset },
							React.createElement('i', { className: 'fa fa-rotate-right' })
						)
					),
					React.createElement('audio', { id: 'beep', src: alarm })
				)
			);
		}
	}]);

	return App;
}(React.Component);

var Panel = function (_React$Component2) {
	_inherits(Panel, _React$Component2);

	function Panel(props) {
		_classCallCheck(this, Panel);

		var _this2 = _possibleConstructorReturn(this, (Panel.__proto__ || Object.getPrototypeOf(Panel)).call(this, props));

		_this2.buttonClick = _this2.buttonClick.bind(_this2);
		return _this2;
	}

	_createClass(Panel, [{
		key: 'buttonClick',
		value: function buttonClick() {
			this.props.handleClick(this.props.pid, this.props.sign);
		}
	}, {
		key: 'render',
		value: function render() {
			var _this3 = this;

			return React.createElement(
				'div',
				{ className: 'panel' },
				React.createElement(
					'div',
					{ id: this.props.label + '-label' },
					this.props.label,
					' length'
				),
				React.createElement(
					'div',
					{ className: 'controls' },
					React.createElement(
						'button',
						{ id: this.props.label + '-decrement',
							onClick: function onClick() {
								_this3.props.adjust(_this3.props.label, -1);
							} },
						React.createElement('i', { className: 'fa fa-arrow-down' })
					),
					React.createElement(
						'div',
						{ className: 'length', id: this.props.label + '-length' },
						this.props.value
					),
					React.createElement(
						'button',
						{ id: this.props.label + '-increment',
							onClick: function onClick() {
								_this3.props.adjust(_this3.props.label, 1);
							} },
						React.createElement('i', { className: 'fa fa-arrow-up' })
					)
				)
			);
		}
	}]);

	return Panel;
}(React.Component);

var container = document.getElementById('app');
var root = ReactDOM.createRoot(container);
root.render(React.createElement(App, null));