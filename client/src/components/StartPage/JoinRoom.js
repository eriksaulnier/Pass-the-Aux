import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, FormGroup, Input } from 'reactstrap';
import { joinRoom } from '../../actions/RoomActions';

class JoinRoom extends Component {
  constructor(props) {
    super(props);

    // initialize component state
    this.state = { joinCode: '' };
  }

  // handle input change event
  handleInputChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value.toUpperCase();
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  // handle form submission
  handleSubmit = event => {
    event.preventDefault();

    // check to make sure room code is provided
    if (!this.state.joinCode) {
      alert('You must enter a room join code!');
      return;
    }

    // join the room
    this.props.joinRoom(this.state.joinCode);
  };

  render() {
    return (
      <Form className="join-room-form" onSubmit={this.handleSubmit}>
        <FormGroup>
          <Input
            type="text"
            name="joinCode"
            onChange={this.handleInputChange}
            value={this.state.joinCode}
            placeholder="Enter Room Code Here"
            autoComplete="off"
          />
        </FormGroup>
        <FormGroup>
          <Button color="primary" type="submit" disabled={!this.state.joinCode}>
            Join Room
          </Button>
        </FormGroup>
      </Form>
    );
  }
}

const mapStateToProps = state => {
  return {
    room: state.roomReducer.room
  };
};

const mapDispatchToProps = dispatch => ({
  joinRoom: room => dispatch(joinRoom(room))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JoinRoom);
