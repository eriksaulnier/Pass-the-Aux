import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendMessage } from '../actions/RoomActions';

export class Messenger extends Component {
    constructor(props) {
        super(props);

        // initialize state
        this.state = {message: ''};
    }

    // handles sending messages
    sendMessage = () => {
        this.props.sendMessage(this.state.message);
        this.setState({message: ''});
    }

    // handle message input change event
    changeMessage = (event) => {
        this.setState({ message: event.target.value });
    }

    render() {
        return (
            <div style={{textAlign: 'center'}}>
                <ul className="message-list">
                    {this.props.messages.map((message, index) => (
                        <li className="message" key={index}>
                            {message}
                        </li>
                    ))}
                </ul>

                <input type="text" name="message" onChange={this.changeMessage.bind(this)} value={this.state.message}/>
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