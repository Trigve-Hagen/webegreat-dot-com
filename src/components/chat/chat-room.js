import React from 'react';
import io from 'socket.io-client';
import config from '../../config/config';
import {
    USER_CONNECTED,
    VERIFY_USER,
    LOGOUT
} from './chat-events';

const socket = io.connect(config.chat_url);

class ChatRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            chatMessage: '',
            chatError: ''
        }
        this.onChange= this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.sendMessage(this.state.chatMessage);
        this.setState({ chatMessage: "" })
    }

    sendTyping = () => {

    }

    render() {
        console.log(this.props.chat);
        return (
            <div>
                <ul>
                    {
                        this.props.chat.messages.map((message) =>
                            <li key={message.id}>{message.sender}: {message.message}</li>
                        )
                    }
                </ul>
                <form name="chat" onSubmit={this.onSubmit}>
                    <div className="input-group">
                        <input
                            value={this.state.chatMessage}
                            onChange={this.onChange}
                            name="chatMessage"
                            type="text"
                            className="form-control"
                            placeholder="Message..."
                            aria-label="Message..."
                            aria-describedby="button-addon2"
                            onKeyUp = { e => { e.keyCode !== 13 && this.sendTyping() } }
                        />
                        <div className="input-group-append">
                            <button
                                className="btn btn-army"
                                type="submit"
                                id="button-addon2"
                            >Go!</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default ChatRoom;