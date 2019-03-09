import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import JoinRoom from './components/JoinRoom';

class App extends Component {
  render() {
    return (
      <div>
        <JoinRoom />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

export default connect(mapStateToProps)(App);
