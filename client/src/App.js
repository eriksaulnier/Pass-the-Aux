import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import JoinRoom from './components/JoinRoom';
import Messenger from './components/Messenger';
import SongQueue from './components/SongQueue';

class App extends Component {
  render() {
    return (
      <div>
        <JoinRoom />
        {this.props.roomReducer.room ? (
          <div>
            <Messenger />
            <SongQueue />
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

export default connect(mapStateToProps)(App);
