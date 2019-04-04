import { Component } from 'react';
import { connect } from 'react-redux';
import Authenticate from '../utils/Auth';

class AuthGuard extends Component {
  isOwner() {
    return Authenticate(this.props.ownerId);
  }

  render() {
    if (this.props.ownerId && this.isOwner()) {
      return this.props.children;
    } else {
      return null;
    }
  }
}

const mapStateToProps = state => {
  return {
    ownerId: state.roomReducer.ownerId
  };
};

export default connect(mapStateToProps)(AuthGuard);
