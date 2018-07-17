import React from "react";
import SockJS from 'sockjs-client';

class Reviever extends React.Component {
constructor(props) {
    super(props);

    this.state = {
      messages: undefined,
      cost: Number,
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

    this.sock2.onmessage = e => {
      console.log('message received:', e.data);
      //incoming message from server, store in state
      this.setState( { messages: "User#"+Math.floor(Math.random()*898)+101+" wants to borrow $" + e.data});
      this.setState( { cost: e.data})
 	
    };

    this.sock1.onclose = () => {
      console.log('close');
    };
    this.sock2.onclose = () => {
      console.log('close');
    };
    this.handleYes = this.handleYes.bind(this)

  }


  handleYes(e) {
    e.preventDefault();
    this.setState({messages: undefined})
    const approve = "approve";
    const cost = this.state.cost;
    this.sock1.send(approve)
    this.sock1.send(cost)
  }
	render () {
		return (
			<div>
		<ul className="list-group">
          {
          this.state.messages && <p> {this.state.messages} <button onClick={this.handleYes}>Yes</button> <button>No</button></p>
          }
        </ul>
			</div>
		)
	}
}
export default Reviever;