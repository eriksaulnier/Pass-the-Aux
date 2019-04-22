import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookie from 'js-cookie';
import { getAccessToken, refreshAccessToken } from './actions/SpotifyActions';
import { history } from './store';
import './App.css';
import StartPage from './components/StartPage';

class App extends Component {
  constructor(props) {
    super(props);

    // check if there is a query in the url to finish authentication
    let query = history.location.search;
    if (query) {
      // parse the query to get parameters
      query = query.substr(1);
      const result = {};
      query.split('&').forEach(function(part) {
        const item = part.split('=');
        result[item[0]] = decodeURIComponent(item[1]);
      });

      // if there is a code present use it for auth
      if (result.code && result.state === Cookie.get('spotify_auth_state')) {
        Cookie.remove('spotify_auth_state');
        this.props.getAccessToken(result.code);
      }

      // reset the url path
      history.push('/');
    }
  }

  componentDidMount() {
    // call function for initial token refresh
    this.refreshAccessToken();

    // set the interval for refreshing the access token
    this.updateInterval = setInterval(() => {
      this.refreshAccessToken();
    }, 1000 * 60); // *60
  }

  componentWillUnmount() {
    // clear the update interval if it is defined
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  // refreshes the Spotify access token
  refreshAccessToken = () => {
    // if the user is logged in refresh the token, otherwise just request a new one
    if (this.props.loggedIn) {
      // only refresh if the token has expired
      if (Date.now() > new Date(this.props.expires)) {
        this.props.refreshAccessToken(this.props.accessToken, this.props.refreshToken);
      }
    } else {
      this.props.getAccessToken();
    }
  };

  render() {
    return <StartPage />;
  }
}

const mapStateToProps = state => ({
  loggedIn: state.spotifyReducer.loggedIn,
  accessToken: state.spotifyReducer.accessToken,
  refreshToken: state.spotifyReducer.refreshToken,
  expires: state.spotifyReducer.expires
});

const mapDispatchToProps = dispatch => ({
  getAccessToken: authCode => dispatch(getAccessToken(authCode)),
  refreshAccessToken: (accessToken, refreshToken) => dispatch(refreshAccessToken(accessToken, refreshToken))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
