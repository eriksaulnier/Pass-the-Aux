import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendMessage } from '../actions/RoomActions';

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
        this.props.sendMessage(this.state.message);
        this.setState({ message: '' });
    }

    render() {
        return (
            <div style={{textAlign: 'center'}}>
                <ul className="message-list">
                    {this.props.messages.map(({user, body}, index) => (
                        <li className="message" key={index}>
                            {`${user}: ${body}`}
                        </li>
                    ))}
                </ul>

                <input type="text" name="message" onChange={this.changeMessage} value={this.state.message}/>
                <button onClick={this.sendMessage}>SEND</button>
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