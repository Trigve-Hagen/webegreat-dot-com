import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Navigation from '../../navigation';
import Footer from '../../footer';
import UploadUser from './upload-user';
import UpdateUser from './update-user';
import Pagination from '../../pagination';
import UserList from './user-list';
import UserItem from './user-item';
import config from '../../../config/config';

class UserRoles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadUserError: '',
            perPage: config.per_page,
            currentPage: this.props.pagination[0].currentPage,
            users: [],
            pages: []
        }
        this.onView = this.onView.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onChangePagination = this.onChangePagination.bind(this);
    }

    fetchUsers() {
        fetch(config.site_url + '/api/roles/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                currentPage: this.props.pagination[0].currentPage,
                perPage: config.per_page,
                token: this.props.authentication[0].token
            })
        }).then(res => res.json())
            .then(json => {
                if(json.success) {
                    let arrayArgs = [];
                    //console.log(json.users);
                    for (let value of Object.values(json.users)) {
                        arrayArgs.push({
                            id: value['userid'],
                            image: value['avatar'],
                            role: value['role'],
                            name: value['name'],
                            email: value['email'],
                            address: value['shipping_address'],
                            city: value['shipping_city'],
                            state: value['shipping_state'],
                            zip: value['shipping_zip'],
                            ifactive: value['store_visible']
                        });
                    }
                    //console.log(arrayArgs);
                    this.setState({
                        loadUserError: json.message,
                        users: arrayArgs
                    });
                } else {
                    this.setState({
                        loadUserError: json.message
                    });
                }
            });
    }

    fetchPages() {
        fetch(config.site_url + '/api/database/pagination', {
            method: 'POST',
            headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
                db: "users",
				perPage: this.state.perPage
			})
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    let range = [];
                    for(let i = 1; i <= json.pages; i++) range.push(i);
                    this.setState({
                        pages: range,
                        loadProductError: json.message
					});
				} else {
                    this.setState({
                        loadProductError: json.message
					});
                }
			});
    }
    
    componentDidMount() {
        this.fetchPages();
        this.fetchUsers();
    }

    getUserObject(userId) {
        let obj={};
        this.state.users.map(user => {
            if(user.id == userId) {
                obj.id = user.id;
                obj.image = user.image ? user.image : 'user-avatar.jpg';
                obj.role = user.role;
                obj.name = user.name;
                obj.email = user.email;
                obj.address = user.address;
                obj.city = user.city;
                obj.state = user.state;
                obj.zip = user.zip;
                obj.ifactive = user.ifactive;
            }
        });
        return obj;
    }

    onChangePagination(e) {
        this.props.updatePagination({ currentPage: e.target.dataset.currentpage });
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.currentPage !== this.props.pagination[0].currentPage) {
            this.setState({ currentPage: this.props.pagination[0].currentPage });
            this.fetchUsers();
            this.fetchPages();
        }
    }

    onView(e) {
        this.props.updateRole(this.getUserObject(e.target.dataset.userid));
    }

    onDelete(e) {
        let userId = e.target.dataset.userid;
        let userObject = this.getUserObject(userId);
        if (confirm(`Are you sure you want to delete ${userObject.name}?`)) {
            fetch(config.site_url + '/api/roles/delete-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: userId,
                token: this.props.authentication[0].token
            })
        }).then(res => res.json())
            .then(json => {
                if(json.success) {
                    let arrayArgs = [];
                    this.state.users.map(user => {
                        if(userId != user.id) {
                            arrayArgs.push({
                                id: user.id,
                                image: user.image != undefined ? user.image : 'user-avatar.jpg',
                                role: user.role,
                                name: user.name,
                                email: user.email,
                                address: user.address,
                                city: user.city,
                                state: user.state,
                                zip: user.zip,
                                ifactive: user.ifactive
                            });
                        }
                    });
                    this.setState({
                        loadProductError: json.message,
                        users: arrayArgs
                    });
                    this.props.updateRole({
                        id: arrayArgs[0].id,
                        image: arrayArgs[0].image,
                        name: arrayArgs[0].name,
                        role: arrayArgs[0].role,
                        email: arrayArgs[0].email,
                        adderss: arrayArgs[0].adderss,
                        city: arrayArgs[0].city,
                        state: arrayArgs[0].state,
                        zip: arrayArgs[0].zip,
                        ifactive: arrayArgs[0].ifactive
                    });
                    //location.reload();
                } else {
                    this.setState({
                        loadProductError: json.message
                    });
                }
            });
        }
    }

    render() {
        if(this.props.authentication[0].authenticated && this.props.authentication[0].role == 3) {
            return (
                <div>
                    <Navigation path="/roles" authenticated={this.props.authentication[0].authenticated} role={this.props.authentication[0].role}/>
                    <div className="container">
                        <div className="row margin-top-50px margin-bottom-50px">
                            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-24">
                                <h2>Create User</h2>
                                {
                                    (this.state.loadUserError) ? (
                                        <label>{this.state.loadUserError}</label>
                                    ) : (null)
                                }
                                <Pagination
                                    pages={this.state.pages}
                                    perPage={this.state.perPage}
                                    currentPage={this.state.currentPage}
                                    onChangePagination={this.onChangePagination}
                                />
                                    <UserList
                                        users={this.state.users}
                                        onView={this.onView}
                                        onDelete={this.onDelete}
                                    />
                                <Pagination
                                    pages={this.state.pages}
                                    perPage={this.state.perPage}
                                    currentPage={this.state.currentPage}
                                    onChangePagination={this.onChangePagination}
                                />
                                <UploadUser />
                            </div>
                            <div className="col-lg-8 col-md-8 col-sm-12 col-xs-24">
                                <UserItem user={this.props.role}/>
                                <UpdateUser role={this.props.role}/>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            )
        } else return <Redirect to='/' />;
    }
}

function mapStateToProps(state) {
    return {
        role: state.role,
        pagination: state.pagination,
        authentication: state.authentication
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateRole: (value) => {
            dispatch({ type: 'UPDATE_ROLE', payload: value})
        },
        updatePagination: (value) => {
            dispatch({ type: 'ADD_CURRENT_PAGE', payload: value})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserRoles)