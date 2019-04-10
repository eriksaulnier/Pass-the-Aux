import { Component } from 'react';
import { connect } from 'react-redux';

class AuthGuard extends Component {
  render() {
    if (this.props.ownerId === this.props.userId) {
      return this.props.children;
    } else {
      return null;
    }
  }
}

const mapStateToProps = state => {
  return {
    ownerId: state.roomReducer.ownerId,
    userId: state.spotifyReducer.userId
  };
};

export default connect(mapStateToProps)(AuthGuard);
