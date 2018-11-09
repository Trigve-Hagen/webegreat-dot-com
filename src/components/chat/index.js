import React from 'react';
import io from 'socket.io-client';
import ChatRequest from './chat-request';
import ChatRoom from './chat-room';
import ChatSidebar from './chat-sidebar'
import config from '../../config/config';
import {
    MESSAGE_RECIEVED,
    USER_CONNECTED,
    COMMUNITY_CHAT,
    MESSAGE_SENT,
    TYPING,
    LOGOUT
} from './chat-events';

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            chats: [],
            activeChat: null,
            socket: io.connect(config.chat_url)
        }
        this.setUser = this.setUser.bind(this);
        this.setActiveChat = this.setActiveChat.bind(this);
    }

    componentDidMount() {
        this.state.socket.emit(COMMUNITY_CHAT, this.resetChat);
    }

    setUser = (user) => {
        this.state.socket.emit(USER_CONNECTED, user);
        this.setState({ user });
    }

    logout = () => {
        this.state.socket.emit(LOGOUT);
        this.setState({ user: null });
    }

    resetChat = (chat) => {
        return this.addChat(chat, true);
    }

    addChat = (chat, reset) => {
        const newChats = reset ? [chat] : [...this.state.chats, chat];
        this.setState({ chats: newChats });

        const messageEvent = `${MESSAGE_RECIEVED}-${chat.id}`;
        const typingEvent = `${TYPING}-${chat.id}`;

        this.state.socket.on(typingEvent);
        this.state.socket.on(messageEvent, this.addMessageToChat(chat.id));
    }

    addMessageToChat = (chatId) => {
        return message => {
            let newChats = this.state.chats.map((chat) => {
                if(chat.id === chatId) chat.messages.push(message);
                return chat;
            });
            this.setState({ chats: newChats })
        }
    }

    updateTypingInChat = (chatId) => {}

    sendMessage = (chatId, message) => {
        this.state.socket.emit(MESSAGE_SENT, {chatId, message})
    }

    sendTyping = (chatId, isTyping) => {
        this.state.socket.emit(TYPING, {chatId, isTyping})
    }

    setActiveChat = (activeChat) => {
        this.setState({ activeChat });
    }

    render() {

        return (
            <div>
                {
                    this.state.user == null
                        ? null
                        : <div className="menu-item border-box">
                            <ChatSidebar
                                logout={this.logout}
                                chats={this.state.chats}
                                user={this.state.user}
                                activeChat={this.state.activeChat}
                                setActiveChat={this.setActiveChat}
                            />
                        </div>
                }
                <div className="menu-item border-box">
                    {
                        this.state.user == null
                            ? null : <h6>Welcome {this.state.user.name}</h6>
                    }
                    {
                        this.state.user == null
                            ? <h5>Need Help?</h5>
                            : <h5>How can we help?</h5>
                    }
                    {
                        this.state.user == null
                            ? <ChatRequest socket={this.state.socket} setUser={this.setUser} />
                            :  this.state.activeChat !== null 
                                ? <ChatRoom
                                        user={this.state.user}
                                        chat={this.state.activeChat}
                                        typingUser={this.state.activeChat.typingUser}
                                        sendMessage={
                                            (message) => {
                                                this.sendMessage(this.state.activeChat.id, message)
                                            }
                                        }
                                        sendTyping={
                                            (isTyping) => {
                                                this.sendTyping(this.state.activeChat.id, isTyping)
                                            }
                                        }
                                    />
                                : <div><h6>Choose a chat.</h6></div>
                    }
                </div>
            </div>
        )
    }
}

export default Chat;