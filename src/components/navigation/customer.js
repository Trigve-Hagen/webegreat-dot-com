import React from 'react';
import { NavLink } from 'react-router-dom';

class Customer extends React.Component {
    render() {
        return (
            <React.Fragment>
                <ul className="nav navbar-nav navbar-right">
                    {
                        this.props.path === '/customer-orders'
                            ? <li className="nav-item active"><NavLink className="nav-link" to='/customer-orders'>My Orders</NavLink></li>
                            : <li className="nav-item"><NavLink className="nav-link" to='/customer-orders'>My Orders</NavLink></li>
                    }
                    {
                        this.props.path === '/profile'
                            ? <li className="nav-item active"><NavLink className="nav-link" to='/profile'>Profile</NavLink></li>
                            : <li className="nav-item"><NavLink className="nav-link" to='/profile'>Profile</NavLink></li>
                    }
                    {
                        this.props.path === '/logout'
                            ? <li className="nav-item active"><NavLink className="nav-link" to='/logout'>Logout</NavLink></li>
                            : <li className="nav-item"><NavLink className="nav-link" to='/logout'>Logout</NavLink></li>
                    }
                </ul>
            </React.Fragment>
        );
    }
}

export default Customer;