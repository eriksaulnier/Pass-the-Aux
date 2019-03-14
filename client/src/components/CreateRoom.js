import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createRoom } from '../actions/RoomActions';
import { Button, Input, Form, FormGroup, Label } from 'reactstrap';

class CreateRoom extends Component {
  constructor(props) {
    super(props);

    // initialize component state
    this.state = { joinCode: '' };

    // setup input change binding
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  // handle input change event
  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  // handle form submission
  handleSubmit = (event) => {
    event.preventDefault();

    // check to make sure room code is provided
    if (!this.state.joinCode) {
      alert('You must enter a room join code!');
      return;
    }

    // join the room
    this.props.createRoom({
        joinCode: this.state.joinCode,
        owner: this.generateID()
    });
  }

  // generates a random id
  generateID = () => {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }

  render() {
    return (
        <Form className="mt-1" onSubmit={this.handleSubmit}>
            <FormGroup row>
                <Label for="joinCode">Enter Room Code:</Label>
                <Input name="joinCode" type="text" onChange={this.handleInputChange}></Input>
            </FormGroup>

            {/* <FormGroup>
                <Label check>
                    <Input type="checkbox" />{' '}
                    Block EXPLICIT songs
                </Label>
            </FormGroup> */}

            <Button color="primary" type="submit">Create Room</Button>
        </Form>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  createRoom: (payload) => dispatch(createRoom(payload))
});

export default connect(null, mapDispatchToProps)(CreateRoom);