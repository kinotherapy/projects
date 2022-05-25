'use strict';

let time = 0;
let interval;
const MILIMINS = 60000;
const alarm = 'https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      break: 5,
      session: 25,
      breaking: false,
      status: 'stopped',
      remaining: 0
    }
    this.adjust = this.adjust.bind(this);
    this.reset = this.reset.bind(this);
    this.startstop = this.startstop.bind(this);
    this.updateTime = this.updateTime.bind(this);
  }
 
  adjust(sect, summand) {
    this.setState(state => {
      let obj = {};
      obj[sect] = Math.min(Math.max(state[sect] + summand, 1), 60);
      return obj;
    })
  }
  
  reset() {
    this.pleaseStop();
    this.setState({
      break: 5,
      session: 25,
      breaking: false,
      status: 'stopped',
      remaining: 0 
    })
    document.getElementById('beep').pause();
    document.getElementById('beep').currentTime = 0
  }
  
  updateTime() {
    let swtch = false;
    if (this.state.remaining <= 0) {
        document.getElementById('beep').play();
        this.setState(state => ({
          remaining: state[state.breaking ? 'session' : 'break'] * 60,
          breaking: !state.breaking
        }))         
    } else {
      this.setState(state => ({
        remaining: state.remaining - 1,
        breaking: state.breaking
      }))      
    }
  }
  
  pleaseStop () {
    if (interval != null) {
      clearInterval(interval);
    }
  }
  
  startstop() {
    switch (this.state.status) {
      case 'running':
        this.pleaseStop();
        this.setState({
          status: 'paused'    
        })
        break;
      case 'stopped':
        let remain = this.state.session * 60;
        interval = setInterval(this.updateTime, 1000);
        this.setState({
          status: 'running',
          remaining: remain
        })
        break;
      default:
        interval = setInterval(this.updateTime, 1000);
        this.setState({
          status: 'running'    
        })
        break;
    }
  }
  
  mmss = (n) => (n < 10 ? '0' + n : n.toString())
  
  render() {
    let qtime = this.state.session + ':00';
    if (this.state.status != 'stopped') {
      let seconds = Math.ceil(this.state.remaining);
      let minutes = Math.floor(seconds / 60);
      let aSeconds = (seconds % 60).toString();
      qtime = this.mmss(minutes) + ':' + this.mmss(aSeconds);
    } else {
      qtime = qtime.length < 5 ? '0' + qtime : qtime;
    }
    return (
      <div id='wrapper'>
        <div id='controls-section'>
          <Panel label={'break'} value={this.state.break} 
            adjust={this.adjust}/>
          <Panel label={'session'} value={this.state.session}
            adjust={this.adjust}/>
        </div>
        <div id='display'>
          <div id='timer-label'>
            {this.state.breaking ? 'Break' : 'Session'}
          </div>
          <div id='time-left'> { qtime } </div>
          <div id='playback'>
            <button id='start_stop' onClick={this.startstop}>
              <i class={this.state.status == 'running' ? "fa fa-pause" : "fa fa-play"} />
            </button>
            <button id='reset' onClick={this.reset}>
              <i class="fa fa-rotate-right"/>
            </button>
          </div>
          <audio id='beep' src={alarm}/>
        </div>
      </div>
    )
  }
}

class Panel extends React.Component {
  constructor(props) {
    super(props)
    this.buttonClick = this.buttonClick.bind(this);
  }
  
  buttonClick () {
    this.props.handleClick(this.props.pid, this.props.sign);
  }
  
  render() {
    return (
      <div class='panel'>
        <div id={this.props.label + '-label'}>{this.props.label} length</div>
        <div class='controls'>
          <button id={this.props.label + '-decrement'} 
            onClick={() => {
              this.props.adjust(this.props.label, -1)
            }}>
            <i class="fa fa-arrow-down" />
          </button>
          <div class='length' id={this.props.label + '-length'}>
            {this.props.value}
          </div>
          <button id={this.props.label + '-increment'}
            onClick={() => {
              this.props.adjust(this.props.label, 1)
            }}>
            <i class="fa fa-arrow-up" />
          </button>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.querySelector('#app'));