import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendMessage } from '../actions/RoomActions';
import { Input, Button, InputGroup, InputGroupAddon, ListGroup, ListGroupItem } from 'reactstrap';

export class Messenger extends Component {
    constructor(props) {
        super(props);

        // initialize component state
        this.state = { message: '' };
    }

    // handle message input change event
    changeMessage = (event) => {
        this.setState({ message: event.target.value });
    }

    // handles sending messages
    sendMessage = () => {
        // check to make sure a message is provided
        if (!this.state.message) {
            console.log('You must enter a message!');
            return;
        }

        this.props.sendMessage(this.state.message);
        this.setState({ message: '' });
    }

    render() {
        return (
            <div>
                <ListGroup className="message-list">
                    {this.props.messages.map(({user, body}, index) => (
                        <ListGroupItem className="message" key={index}>
                            {`${user}: ${body}`}
                        </ListGroupItem>
                    ))}
                </ListGroup>

                <InputGroup>
                    <Input type="text" name="message" onChange={this.changeMessage} value={this.state.message}/>
                    <InputGroupAddon addonType="append">
                        <Button color="primary" onClick={this.sendMessage}>Send</Button>
                    </InputGroupAddon>
                </InputGroup>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        messages: state.roomReducer.messages
    };
};

const mapDispatchToProps = dispatch => ({
    sendMessage: (message) => dispatch(sendMessage(message))
});

export default connect(mapStateToProps, mapDispatchToProps)(Messenger);