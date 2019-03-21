import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Container, Row, Col, Button } from 'reactstrap';
import { joinRoom } from '../../actions/RoomActions';
import JoinRoomComponent from './JoinRoom';
import CreateRoomComponent from './CreateRoom';

class StartPage extends Component {
  constructor(props) {
    super(props);

    // initialize component state
    this.state = { creatingRoom: false };

    // if there is a room already in the store, attempt to join it
    if (this.props.room) {
      this.props.joinRoom(this.props.room);
    }
  }

  // changes the route when the room code is changed in the state
  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (this.props.room && prevProps.room !== this.props.room) {
      this.props.route('/room');
    }
  };

  // toggles beteen components for creating and joining rooms
  toggleIsCreating = () => {
    const isCreatingRoom = this.state.creatingRoom;
    this.setState({ creatingRoom: !isCreatingRoom });
  };

  render() {
    return (
      <Container>
        <Row>
          <Col className="mt-5 text-center" sm="10" md={{ size: 6, offset: 3 }} lg={{ size: 4, offset: 4 }}>
            <h2>Pass the Aux</h2>
            {this.state.creatingRoom ? (
              <div>
                <CreateRoomComponent />
                <Button className="mt-3" color="secondary" onClick={this.toggleIsCreating}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div>
                <JoinRoomComponent />
                <p className="mt-4">OR</p>
                <Button color="secondary" onClick={this.toggleIsCreating}>
                  Create a New Room
                </Button>
              </div>
            )}
          </Col>
        </Row>
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
  joinRoom: room => dispatch(joinRoom(room))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StartPage);
