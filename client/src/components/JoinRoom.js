import React, { Component } from 'react';
import { connect } from 'react-redux';
import { joinRoom } from '../actions/RoomActions';
import { Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';

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
  }

  render() {
    return (
      <div className="mt-5" style={{textAlign: 'center'}}>
        <h2>Pass the Aux</h2>
        <InputGroup className="mt-4">
          <Input type="text" name="room-code" onChange={this.changeRoomCode} value={this.state.roomCode}/>
          <InputGroupAddon addonType="append">
            <Button color="primary" onClick={this.joinRoom}>Join Room</Button>
          </InputGroupAddon>
        </InputGroup>
        <p className="mt-2">If the room code does not yet exist it will be created</p>
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
  joinRoom: (room) => dispatch(joinRoom(room))
});

export default connect(mapStateToProps, mapDispatchToProps)(JoinRoom);