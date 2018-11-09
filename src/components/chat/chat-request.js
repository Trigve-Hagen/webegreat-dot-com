import React from 'react';
import {
    USER_CONNECTED,
    VERIFY_USER,
    LOGOUT
} from './chat-events';

class ChatRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chatRequestName: '',
            chatRequestError: ''
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    setUser = ({ user, isUser }) => {
        if(isUser) this.setState({ chatRequestError: 'User name taken' })
        else this.props.setUser(user);
    }
    
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.props.socket.emit(VERIFY_USER, this.state.chatRequestName, this.setUser);
    }

    render() {
        return (
            <form
                name="help-request"
                onSubmit={this.onSubmit}
            >
                {
                    (this.state.chatRequestError) ? (
                        <label>{this.state.chatRequestError}</label>
                    ) : (null)
                }
                <div className="input-group">
                    <input
                        value={this.state.chatRequestName}
                        onChange={this.onChange}
                        name="chatRequestName"
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        aria-label="Name"
                        aria-describedby="button-addon2"
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-army"
                            type="submit"
                            id="button-addon2"
                        >Submit</button>
                    </div>
                </div>
            </form>
        )
    }
}

export default ChatRequest;