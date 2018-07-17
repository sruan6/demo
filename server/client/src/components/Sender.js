import React from "react";
import SockJS from 'sockjs-client';

class Sender extends React.Component {
constructor(props) {
    super(props);

    this.state = {
      waiting: null,
      approve: null,
      cost: null,
      sentence: []
    }


    //create a new socket connection
    //see documentation https://github.com/sockjs/sockjs-client#getting-started
    this.sock1 = new SockJS('https://chatserverapp1.herokuapp.com/chat');
    this.sock2 = new SockJS('https://chatserverapp2.herokuapp.com/chat');

    this.sock1.onopen = () => {
      console.log('connection open');
    };

    this.sock2.onopen = () => {
      console.log('connection open');
    };

    this.sock1.onmessage = res => {
      console.log('message received:', res);
      if(res.data === "approve"){
        this.setState({approve: res.data})
      }else{
        this.setState({cost: res.data,
                      waiting: null
        })
      }
      //incoming message from server, store in state
      if(this.state.cost !== null) {

        let newSen = ["User#"+Math.floor(Math.random()*898)+101 +" has " + this.state.approve + " for " + this.state.cost]
      this.setState({ sentence: [newSen, ...this.state.sentence] })
      this.setState({ cost: null })
    };
    };

    this.sock1.onclose = () => {
      console.log('close');
    };
    this.sock2.onclose = () => {
      console.log('close');
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.fullScreen = this.fullScreen.bind(this);

  }

  handleFormSubmit(e) {
    e.preventDefault();
    let value = this.refs.messageText.value
    this.setState({waiting: "waiting..."})
    this.sock2.send(value);
  };
  fullScreen(e) {
    e.preventDefault();
      let doc = window.document;
      let docEl = doc.documentElement;

      let requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
      let cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

      if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl);
      }
      else {
        cancelFullScreen.call(doc);
      }

  }

	render () {
    let i = 0;
		return (
         <div className="container">
          <form onSubmit={this.handleFormSubmit}>
            <div className="form-group">
              <div className="input-group">
                <input type="number" min="0.01" step="0.01" max="2500" ref="messageText" className="form-control" placeholder="5.00" />
                <span className="input-group-btn">
                  <button type="submit" className="btn btn-primary">Send!</button>
                </span>
              </div>
              {this.state.waiting && <p>{this.state.waiting}</p>}
            {this.state.sentence && this.state.sentence.map(message => {
            return <li className="list-group-item" key={i++}>{message}</li>
          })}
            </div>
          </form>
          <button onClick={this.fullScreen}>FullScreen</button>
        </div>
		)
	}
}

export default Sender;