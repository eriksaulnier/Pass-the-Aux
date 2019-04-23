import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Input, Form, FormGroup, Label } from 'reactstrap';
import { createRoom } from '../../actions/RoomActions';
class CreateRoom extends Component {
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
    this.props.createRoom({
      joinCode: this.state.joinCode,
      owner: this.props.userId
    });
  };

  render() {
    return (
      <Form className="create-room-form" onSubmit={this.handleSubmit}>
        <h3>Create Room</h3>
        <FormGroup>
          <Label for="joinCode">Join Code For The Room:</Label>
          <Input
            name="joinCode"
            type="text"
            onChange={this.handleInputChange}
            value={this.state.joinCode}
            autocomplete="off"
          />
        </FormGroup>
        {/* <FormGroup>
            <Label check>
                <Input type="checkbox" />{' '}
                Block EXPLICIT songs
            </Label>
        </FormGroup> */}
        <Button color="primary" type="submit">
          Create Room
        </Button>
      </Form>
    );
  }
}

const mapStateToProps = state => {
  return {
    userId: state.spotifyReducer.userId
  };
};

const mapDispatchToProps = dispatch => ({
  createRoom: payload => dispatch(createRoom(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateRoom);
