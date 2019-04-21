import React, { Component } from 'react';
import { connect } from 'react-redux';
import Script from 'react-load-script';
import { playerInitSuccess, playerInitError } from '../../actions/SpotifyActions';
import { updatePlaybackState, skipSong } from '../../actions/PlaybackActions';
import { spotifyClient } from '../../utils/SpotifyClient';

export class NowPlaying extends Component {
  componentDidMount = () => {
    // setup callback for when the spotify sdk has finished loading
    window.onSpotifyWebPlaybackSDKReady = () => {
      // call successful load event
      this.handleLoadSuccess();

      // set up an interval for updating the playback state
      this.updateInterval = setInterval(() => {
        // request the current playback state to update progress
        spotifyClient.getMyCurrentPlaybackState().then(
          res => {
            // update the progress value stored in state
            this.props.updatePlaybackState({
              position: res.progress_ms
            });
          },
          err => {
            console.error(err);
          }
        );
      }, 1000);
    };
  };

  // remove all event listeners when this component is unmounting
  componentWillUnmount = () => {
    // if the player is defined remove all the event listeners
    if (this.webPlaybackInstance) {
      this.webPlaybackInstance.removeListener('initialization_error');
      this.webPlaybackInstance.removeListener('authentication_error');
      this.webPlaybackInstance.removeListener('account_error');
      this.webPlaybackInstance.removeListener('playback_error');
      this.webPlaybackInstance.removeListener('player_state_changed');
      this.webPlaybackInstance.removeListener('ready');
      this.webPlaybackInstance.removeListener('not_ready');
    }

    // clear the update interval if it is defined
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  };

  // handle successful load of spotify sdk
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
      // check to see if the current song has finished playback and should be skipped
      if (
        state &&
        state.paused &&
        state.position === 0 &&
        this.props.currentSong &&
        state.restrictions.disallow_resuming_reasons &&
        state.restrictions.disallow_resuming_reasons[0] === 'not_paused' &&
        state.track_window.current_track.id === this.props.currentSong.spotifyId
      ) {
        // check if the song has already been marked as ended
        if (this.songEnded) {
          // skip to the next song
          this.props.skipSong();

          delete this.songEnded;
        } else {
          this.songEnded = true;
        }
      } else {
        delete this.songEnded;
      }

      // call playback update state action
      this.props.updatePlaybackState(state);
    });

    // player init listeners
    this.webPlaybackInstance.addListener('ready', data => {
      console.log('Ready with Device ID', data.device_id);

      this.props.playerInitSuccess({
        deviceId: data.device_id,
        accessToken: this.props.accessToken,
        currentSong: this.props.currentSong,
        position: this.props.position || 0
      });
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
    return <Script url="https://sdk.scdn.co/spotify-player.js" />;
  }
}

const mapStateToProps = state => {
  return {
    accessToken: state.spotifyReducer.accessToken,
    currentSong: state.playbackReducer.currentSong,
    position: state.playbackReducer.position,
    isPlaying: state.playbackReducer.isPlaying
  };
};

const mapDispatchToProps = dispatch => ({
  playerInitSuccess: deviceId => dispatch(playerInitSuccess(deviceId)),
  playerInitError: error => dispatch(playerInitError(error)),
  updatePlaybackState: state => dispatch(updatePlaybackState(state)),
  skipSong: () => dispatch(skipSong())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NowPlaying);
