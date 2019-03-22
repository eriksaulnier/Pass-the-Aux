import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Container, Button } from 'reactstrap';
import { leaveRoom } from '../../actions/RoomActions';
import { resetQueue } from '../../actions/QueueActions';
import SongQueueComponent from './SongQueue';
import AddSongComponent from './AddSong';

class RoomPage extends Component {
  constructor(props) {
    super(props);

    // if the user is not in a room route back to the main page
    if (!this.props.room) {
      this.props.route('/');
    }
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

  render() {
    return (
      <Container>
        <div className="mb-4">
          <h2>
            Current Room:
            {this.props.room}
          </h2>
          <Button color="secondary" onClick={this.leaveRoom}>
            Leave Room
          </Button>
          <Button color="danger" onClick={this.resetQueue}>
            Reset Queue
          </Button>
        </div>
        <AddSongComponent />
        <SongQueueComponent />
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    room: state.roomReducer.room
  };
};

const mapDispatchToProps = dispatch => ({
  route: path => dispatch(push(path)),
  leaveRoom: () => dispatch(leaveRoom()),
  resetQueue: () => dispatch(resetQueue())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoomPage);
