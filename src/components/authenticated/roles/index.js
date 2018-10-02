import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Navigation from '../../navigation';
import Footer from '../../footer';
import UploadUser from './upload-user';
import UpdateUser from './update-user';
import UserList from './user-list';
import UserItem from './user-item';

class UserRoles extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(this.props.authentication[0].authenticated) {
            return (
                <div>
                    <Navigation path="/roles" authenticated={this.props.authentication[0].authenticated}/>
                    <div className="container">
                        <div className="row space-bottom-50px">
                            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-24">
                                <h1>User Roles Page</h1>
                                <UserList />
                                <UploadUser />
                            </div>
                            <div className="col-lg-8 col-md-8 col-sm-12 col-xs-24">
                                <UserItem user={this.props.role}/>
                                <UpdateUser />
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
        authentication: state.authentication
    }
}

export default connect(mapStateToProps)(UserRoles)