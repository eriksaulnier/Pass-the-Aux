import React, { Component } from 'react';
import { connect } from 'react-redux';
import Authenticate from '../utils/Auth';

class AuthGuard extends Component {
  isOwner() {
    return Authenticate(this.props.ownerId);
  }

  render() {
    return <div>{this.props.ownerId && this.isOwner() ? this.props.children : null}</div>;
  }
}

const mapStateToProps = state => {
  return {
    ownerId: state.roomReducer.ownerId
  };
};

export default connect(mapStateToProps)(AuthGuard);
