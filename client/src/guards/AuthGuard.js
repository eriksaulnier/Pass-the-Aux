import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

class AuthGuard extends Component {
  isOwner() {
    console.log(Cookies.get('user_id'), this.props.ownerId);
    return Cookies.get('user_id') === this.props.ownerId;
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
