import React, { Component } from 'react';
import { connect } from 'react-redux';
import Script from 'react-load-script';

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
      console.error(message);
    });
    this.webPlaybackInstance.addListener('authentication_error', ({ message }) => {
      console.error(message);
    });
    this.webPlaybackInstance.addListener('account_error', ({ message }) => {
      console.error(message);
    });
    this.webPlaybackInstance.addListener('playback_error', ({ message }) => {
      console.error(message);
    });

    // playback status updates listeners
    this.webPlaybackInstance.addListener('player_state_changed', state => {
      console.log(state);
    });

    // ready listener
    this.webPlaybackInstance.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
    });

    // not ready listener
    this.webPlaybackInstance.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
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
    currentSong: state.playbackReducer.currentSong,
    isPlaying: state.playbackReducer.isPlaying,
    accessToken: state.spotifyReducer.accessToken
  };
};

const mapDispatchToProps = dispatch => ({
  //   playSong: songId => dispatch(playSong(songId)),
  //   pauseSong: songId => dispatch(pauseSong(songId)),
  //   skipSong: songId => dispatch(skipSong(songId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NowPlaying);
