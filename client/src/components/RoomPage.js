import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import Messenger from './Messenger';
import SongQueue from './SongQueue';

class RoomPage extends Component {
  constructor(props) {
    super(props);

    // if the user is not in a room route back to the main page
    if (!this.props.room) {
      this.props.route('/');
    }
  }

  render() {
    return (
      <div style={{textAlign: 'center'}}>
        <Messenger />
        <SongQueue />
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
  route: (path) => dispatch(push(path))
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomPage);