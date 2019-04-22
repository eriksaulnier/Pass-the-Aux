import { Component } from 'react';
import { connect } from 'react-redux';

class AuthGuard extends Component {
  render() {
    return this.props.isRoomOwner ? this.props.children : null;
  }
}

const mapStateToProps = state => {
  return {
    isRoomOwner: state.spotifyReducer.isRoomOwner
  };
};

export default connect(mapStateToProps)(AuthGuard);
