import React from 'react';
import { connect } from 'react-redux';
import Pagination from '../../pagination';
import config from '../../../config/config';

class UserList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        //this.props.resetProduct();
        return (
            <div>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        <Pagination
                            database="users"
                            perPage={config.per_page}
                            token={this.props.authentication[0].token}
                        />
                        <ul className="ul-styles">
                            {
                                this.props.users.map(user => 
                                    <li key={user.id}> 
                                        {user.name} 
                                        <a href="#" data-userid={user.id} onClick={this.props.onView}> View</a>  
                                        <a href="#" data-userid={user.id} onClick={this.props.onDelete}> Delete</a> 
                                    </li>
                                )
                            }
                        </ul>
                        <Pagination
                            database="users"
                            perPage={config.per_page}
                            token={this.props.authentication[0].token}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        role: state.role,
        pagination: state.pagination,
        authentication: state.authentication
    }
}

export default connect(mapStateToProps)(UserList);