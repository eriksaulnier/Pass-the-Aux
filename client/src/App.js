import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import { socket, subscribeToMessages } from './utils/Socket';
import JoinRoom from './components/JoinRoom';
import Messenger from './components/Messenger';
import { receiveMessage } from './actions/RoomActions';

class App extends Component {
  constructor() {
    super();

    // console log all socket messages
    subscribeToMessages((message) => {
      this.props.receiveMessage(message);
    });
  }

  render() {
    return (
        <div>
          <JoinRoom socket={socket} />
          {this.props.roomReducer.room ? (
            <Messenger />
          ) : null}
        </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  receiveMessage: message => dispatch(receiveMessage(message))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
