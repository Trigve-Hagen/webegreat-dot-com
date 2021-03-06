import React from 'react';
import io from 'socket.io-client';
import ChatRequest from './chat-request';
import ChatRoom from './chat-room';
import ChatSidebar from './chat-sidebar'
import config from '../../config/config';
import {
    MESSAGE_RECIEVED,
    PRIVATE_MESSAGE,
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
            socket: io.connect(config.site_url)
        }
        this.setUser = this.setUser.bind(this);
        this.setActiveChat = this.setActiveChat.bind(this);
    }

    componentDidMount() {
        const { socket } = this.state;
        this.initSocket(socket);
    }

    initSocket(socket) {
        socket.emit(COMMUNITY_CHAT, this.resetChat);
        socket.on(PRIVATE_MESSAGE, this.addChat);
        socket.on('connect', () => {
            socket.emit(COMMUNITY_CHAT, this.resetChat);
        });
    }

    sendOpenPrivateMessage = (reciever) => {
        this.state.socket.emit(
            PRIVATE_MESSAGE,
            {reciever, sender: this.state.user.name, activeChat: this.state.activeChat}
        );
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

    addChat = (chat, reset = false) => {
        const newChats = reset ? [chat] : [...this.state.chats, chat];
        this.setState({ chats: newChats, activeChat: reset ? chat : this.state.activeChat });

        const messageEvent = `${MESSAGE_RECIEVED}-${chat.id}`;
        const typingEvent = `${TYPING}-${chat.id}`;

        this.state.socket.on(typingEvent, this.updateTypingInChat(chat.id));
        this.state.socket.on(messageEvent, this.addMessageToChat(chat.id));
    }

    checkForDuplicates = (messages, messageId) => {
        let ifDuplicate = false;
        messages.map((message) => {
            if(messageId.localeCompare(message.id) == 0) ifDuplicate = true;
        });
        return ifDuplicate;
    }

    addMessageToChat = (chatId) => {
        return message => {
            let newChats = this.state.chats.map((chat) => {
                if(chat.id === chatId && !this.checkForDuplicates(chat.messages, message.id)) chat.messages.push(message);
                return chat;
            });
            this.setState({ chats: newChats })
        }
    }

    updateTypingInChat = (chatId) => {
        return ({isTyping, user}) => {
            if(user !== this.state.user.name) {
                let newChats = this.state.chats.map((chat) => {
                    if(chat.id === chatId) {
                        if(isTyping && !chat.typingUsers.includes(user)) {
                            chat.typingUsers.push(user);
                        } else if(!isTyping && chat.typingUsers.includes(user)) {
                            chat.typingUsers = chat.typingUsers.filter(u => u !== user)
                        }
                    }
                    return chat;
                })
                this.setState({ chats: newChats });
            }
        }
    }

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
                            <p>To reach support type Support into the search and a private message will be started if support is available. Otherwise a community chat is started by default please try to find help here till we return. To start a private chat type the name into the search and if they are connected it will create a link under CHATS to start the chat.</p>
                            <ChatSidebar
                                logout={this.logout}
                                chats={this.state.chats}
                                user={this.state.user}
                                activeChat={this.state.activeChat}
                                setActiveChat={this.setActiveChat}
                                onSendPrivateMessage={this.sendOpenPrivateMessage}
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
                                        typingUsers={this.state.activeChat.typingUsers}
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