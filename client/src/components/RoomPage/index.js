import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Container, Button } from 'reactstrap';
import { isMobile } from 'react-device-detect';
import { leaveRoom } from '../../actions/RoomActions';
import { resetQueue } from '../../actions/QueueActions';
import { getAccessToken } from '../../actions/SpotifyActions';
import AuthGuard from '../../guards/AuthGuard';
import SongQueueComponent from './SongQueue';
import AddSongComponent from './AddSong';
import NowPlayingComponent from './NowPlaying';
import FullScreenView from './FullScreenView';
import icon from '../../icon.svg';
import './RoomPage.scss';

class RoomPage extends Component {
  constructor(props) {
    super(props);

    // setup spotify api connection if no access code is present
    if (!this.props.loggedIn) {
      this.props.connectSpotify();
    }

    // if the user is not in a room route back to the main page
    if (!props.room) {
      this.props.route('/');
    }

    // initialize component state
    this.state = {
      fullscreen: false
    };
  }

  // handles leaving the room
  leaveRoom = () => {
    this.props.leaveRoom();
    this.props.route('/');
  };

  // handles reseting the queue
  resetQueue = () => {
    this.props.resetQueue();
  };

  // triggers full screen mode with the provided value
  triggerFullscreen = value => {
    // only allow fullscreen mode on non-mobile devices
    if (isMobile) {
      alert('Fullscreen mode is not available on mobile');
    } else {
      this.setState({ fullscreen: value });
    }
  };

  render() {
    return (
      <Container className="room-page-container">
        <div className="room-header">
          <div className="room-title">
            <img src={icon} alt="Pass the Aux" />
            <h2>
              Current Room:
              <b>{` ${this.props.room}`}</b>
            </h2>
          </div>
          <Button color="secondary" onClick={this.leaveRoom}>
            Leave
          </Button>
        </div>
        <AddSongComponent />
        <AuthGuard>
          <div className="room-controls">
            <h4>Room Host Controls:</h4>
            <Button color="danger" onClick={this.resetQueue}>
              Reset Queue
            </Button>
            <Button onClick={() => this.triggerFullscreen(true)}>Fullscreen</Button>
            <FullScreenView fullscreen={this.state.fullscreen} closeCallback={() => this.triggerFullscreen(false)} />
          </div>
        </AuthGuard>
        <NowPlayingComponent />
        <SongQueueComponent />
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    room: state.roomReducer.room,
    loggedIn: state.spotifyReducer.loggedIn,
    isRoomOwner: state.spotifyReducer.isRoomOwner
  };
};

const mapDispatchToProps = dispatch => ({
  route: path => dispatch(push(path)),
  leaveRoom: () => dispatch(leaveRoom()),
  resetQueue: () => dispatch(resetQueue()),
  connectSpotify: () => dispatch(getAccessToken())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoomPage);
