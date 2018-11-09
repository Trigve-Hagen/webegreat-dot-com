import React from 'react';

class ChatSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchChats: '',
            searchChatsError: ''
        }
        this.onChange= this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
    }

    render() {
        return (
            <div>
                <form name="saerch-chats" onSubmit={this.onSubmit}>
                    <div className="input-group">
                        <input
                            value={this.state.searchChats}
                            onChange={this.onChange}
                            name="searchChats"
                            type="text"
                            className="form-control"
                            placeholder="Search..."
                            aria-label="Search..."
                            aria-describedby="button-addon2"
                        />
                        <div className="input-group-append">
                            <button
                                className="btn btn-army"
                                type="submit"
                                id="button-addon2"
                            >Search</button>
                        </div>
                    </div>
                </form>
                <div
                    className="users"
                    ref='users'
                    onClick={ (e) => { (e.target === this.refs.user) && this.props.setActiveChat(null) } }
                >
                    <h5 className="mt-1">Chats</h5>
                    {
                        this.props.chats.map((chat) => {
                            
                            if(chat.name) {
                                const user = chat.users.find(({name}) => {
                                    return name !== this.props.name;
                                }) || { name: "Community" }
                                const classNames = (this.props.activeChat && this.props.activeChat.id === chat.id) ? 'active' : ''

                                return (
                                    <div key={chat.id} className={ `row px-3 ${classNames}` }>
                                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                            <a href="#" onClick={
                                                (e) => {
                                                    e.preventDefault();
                                                    this.props.setActiveChat(chat)
                                                } }
                                            >
                                                { user.name }
                                            </a>
                                        </div>
                                    </div>
                                )
                            }
                            return null;
                        })
                    }
                </div>
                <div className="row mt-2">
                    <div
                        className="col-xl-12 col-lg-12 col-md-12 col-sm-12 text-right"
                        style={{ paddingLeft: '0px' }}
                    >
                        <button
                            onClick={ () => { this.props.logout() } }
                            title="Logout"
                            className="btn btn-army"
                        >Logout</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChatSidebar;