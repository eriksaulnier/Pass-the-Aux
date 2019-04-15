import React, { Component } from 'react';
import { connect } from 'react-redux';
import Script from 'react-load-script';
import { playerInitSuccess, playerInitError } from '../../actions/SpotifyActions';
import { updatePlaybackState } from '../../actions/PlaybackActions';

export class NowPlaying extends Component {
  webPlaybackInstance = null;

  componentDidMount = () => {
    // setup callback for sdk ready event
    window.onSpotifyWebPlaybackSDKReady = () => {
      this.handleLoadSuccess();
    };
  };

  componentWillUnmount = () => {
    // if the player is defined remove all event listeners
    if (this.webPlaybackInstance) {
      this.webPlaybackInstance.removeListener('initialization_error');
      this.webPlaybackInstance.removeListener('authentication_error');
      this.webPlaybackInstance.removeListener('account_error');
      this.webPlaybackInstance.removeListener('playback_error');
      this.webPlaybackInstance.removeListener('player_state_changed');
      this.webPlaybackInstance.removeListener('ready');
      this.webPlaybackInstance.removeListener('not_ready');
    }
  };

  handleLoadSuccess = () => {
    // create a new instance of the spotify player
    this.webPlaybackInstance = new window.Spotify.Player({
      name: 'Pass The Aux',
      getOAuthToken: cb => {
        cb(this.props.accessToken);
      }
    });

    // error handling listeners
    this.webPlaybackInstance.addListener('initialization_error', ({ message }) => {
      this.props.playerInitError(message);
    });
    this.webPlaybackInstance.addListener('authentication_error', ({ message }) => {
      this.props.playerInitError(message);
    });
    this.webPlaybackInstance.addListener('account_error', ({ message }) => {
      this.props.playerInitError(message);
    });
    this.webPlaybackInstance.addListener('playback_error', ({ message }) => {
      this.props.playerInitError(message);
    });

    // playback status listener
    this.webPlaybackInstance.addListener('player_state_changed', state => {
      this.props.updatePlaybackState(state);
    });

    // player init listeners
    this.webPlaybackInstance.addListener('ready', data => {
      this.props.playerInitSuccess({
        deviceId: data.device_id,
        accessToken: this.props.accessToken
      });
      // console.log('Ready with Device ID', data.device_id);
    });
    this.webPlaybackInstance.addListener('not_ready', data => {
      console.log('Device ID has gone offline', data.device_id);
    });

    // connect to the player
    this.webPlaybackInstance.connect().then(success => {
      if (success) {
        console.log('The Web Playback SDK successfully connected to Spotify!');
      }
    });
  };

  render() {
    return (
      <div>
        <Script url="https://sdk.scdn.co/spotify-player.js" />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    accessToken: state.spotifyReducer.accessToken
  };
};

const mapDispatchToProps = dispatch => ({
  playerInitSuccess: deviceId => dispatch(playerInitSuccess(deviceId)),
  playerInitError: error => dispatch(playerInitError(error)),
  updatePlaybackState: state => dispatch(updatePlaybackState(state))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NowPlaying);
