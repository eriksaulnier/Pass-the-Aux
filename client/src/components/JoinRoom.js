import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { joinRoom } from '../actions/RoomActions';

class JoinRoom extends Component {
  constructor(props) {
    super(props);

    // initialize component state
    this.state = { roomCode: '' };
  }

  // handle room code input change event
  changeRoomCode = (event) => {
    this.setState({ roomCode: event.target.value });
  }
  
  // handles joining rooms
  joinRoom = () => {
    // check to make sure room code is provided
    if (!this.state.roomCode) {
      console.log('You must enter a room join code!');
      return;
    }

    // join the room
    this.props.joinRoom(this.state.roomCode);

    // update the route
    this.props.route('/room');
  }

  render() {
    return (
      <div style={{textAlign: 'center'}}>
        <input type="text" name="room-code" onChange={this.changeRoomCode} value={this.state.roomCode}/>
        <button onClick={this.joinRoom}>JOIN ROOM</button>
        <p>If the room code does not yet exist it will be created</p>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    room: state.roomReducer.room
  };
};

const mapDispatchToProps = dispatch => ({
  joinRoom: (room) => dispatch(joinRoom(room)),
  route: (path) => dispatch(push(path))
});

export default connect(mapStateToProps, mapDispatchToProps)(JoinRoom);