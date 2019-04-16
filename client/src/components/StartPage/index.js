import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Container, Row, Col, Button } from 'reactstrap';
import { FaSpotify } from 'react-icons/fa';
import Cookie from 'js-cookie';
import { joinRoom } from '../../actions/RoomActions';
import { getAccessToken } from '../../actions/SpotifyActions';
import JoinRoomComponent from './JoinRoom';
import CreateRoomComponent from './CreateRoom';
import { history } from '../../store';
import packageJson from '../../../package.json';

class StartPage extends Component {
  constructor(props) {
    super(props);

    // initialize component state
    this.state = { creatingRoom: false };

    // if there is a room already in the store, attempt to join it
    if (this.props.room) {
      this.props.joinRoom(this.props.room);
    }

    // check if there is a query in the url
    let query = history.location.search;
    if (query) {
      // parse the query to get parameters
      query = query.substr(1);
      const result = {};
      query.split('&').forEach(function(part) {
        const item = part.split('=');
        result[item[0]] = decodeURIComponent(item[1]);
      });

      // if there is a code present use it for auth
      if (result.code && result.state === Cookie.get('spotify_auth_state')) {
        Cookie.remove('spotify_auth_state');
        this.props.getAccessToken(result.code);
      }

      // reset the url path
      history.push('/');
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

  // start authentication process with spotify
  openSpotifyAuthPopup = () => {
    // request an authentication url from the server
    fetch('/spotify_login')
      .then(res => res.json()) // parse response
      .then(
        data => {
          // redirect to the returned url
          window.location = data.url;
        },
        err => {
          console.error(err);
        }
      );
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
                {this.props.userId ? (
                  <div>
                    <p>
                      Logged in as
                      <b>{` ${this.props.userId}`}</b>
                    </p>
                    <Button color="secondary" onClick={this.toggleIsCreating}>
                      Create a New Room
                    </Button>
                  </div>
                ) : (
                  <Button color="secondary" onClick={this.openSpotifyAuthPopup}>
                    <FaSpotify className="mr-2" />
                    Login to Create Room
                  </Button>
                )}
              </div>
            )}
            <p className="mt-4">
              <i>{`Version: ${packageJson.version}`}</i>
            </p>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    room: state.roomReducer.room,
    userId: state.spotifyReducer.userId
  };
};

const mapDispatchToProps = dispatch => ({
  route: path => dispatch(push(path)),
  joinRoom: room => dispatch(joinRoom(room)),
  getAccessToken: authCode => dispatch(getAccessToken(authCode))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StartPage);
