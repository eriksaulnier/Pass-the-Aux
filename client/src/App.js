import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import StartPage from './components/StartPage';

class App extends Component {
  render() {
    return (
      <StartPage />
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

export default connect(mapStateToProps)(App);
