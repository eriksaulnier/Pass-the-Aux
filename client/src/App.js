import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import { Container, Row, Col } from 'reactstrap';
import JoinRoom from './components/JoinRoom';

class App extends Component {
  render() {
    return (
      <Container>
        <Row>
          <Col sm="10" md={{ size: 6, offset: 3 }} lg={{ size: 4, offset: 4 }}>
            <JoinRoom />
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

export default connect(mapStateToProps)(App);
