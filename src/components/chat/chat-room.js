import React from 'react';

class ChatRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chatMessage: '',
            isTyping: false
        }
        this.onChange= this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.scrollDown = this.scrollDown.bind(this);
    }
    
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.sendMessage(this.state.chatMessage);
        this.setState({ chatMessage: "" });
    }

    componentWillUnmount() {
        this.stopCheckingTyping();
    }

    sendTyping = () => {
        this.lastUpdateTime = Date.now();
        if(!this.state.isTyping) {
            this.setState({ isTyping: true });
            this.props.sendTyping(true);
            this.startCheckingTyping();
        }
    }

    startCheckingTyping = () => {
        this.typingInterval = setInterval(() => {
            if((Date.now() - this.lastUpdateTime) > 300) {
                this.setState({ isTyping: false });
                this.stopCheckingTyping();
            }
        }, 300)
    }

    stopCheckingTyping = () => {
        if(this.typingInterval) {
            clearInterval(this.typingInterval);
            this.props.sendTyping(false);
        }
    }

    scrollDown() {
        const { messageContainer } = this.refs;
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }

    componentDidMount() {
        this.scrollDown();
    }

    componentDidUpdate(prevProps, preState) {
        this.scrollDown();
    }

    render() {
        //console.log(this.props.chat);
        /**/
        return (
            <div>
                <div ref='messageContainer' style={{ height: '300px', overflowY: 'scroll', paddingBottom: '10px' }}>
                    <ul>
                        {
                            this.props.chat.messages.map((message) =>
                                <li key={message.id}><b>{message.sender}</b>: {message.message}</li>
                            )
                        }
                    </ul>
                </div>
                <div>
                    {
                        this.props.typingUsers.map((name) => {
                            return (
                                <div key={name}>
                                    {`${name} is typing . . .`}
                                </div>
                            )
                        })
                    }
                </div>
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