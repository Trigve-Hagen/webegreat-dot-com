import React from 'react';
import { NavLink } from 'react-router-dom';

class Customer extends React.Component {
    render() {
        return (
            <React.Fragment>
                <ul className="nav navbar-nav navbar-right">
                    {
                        this.props.path === '/customer-orders'
                            ? <li className="active"><NavLink to='/customer-orders'>My Orders</NavLink></li>
                            : <li><NavLink to='/customer-orders'>My Orders</NavLink></li>
                    }
                    {
                        this.props.path === '/profile'
                            ? <li className="active"><NavLink to='/profile'>Profile</NavLink></li>
                            : <li><NavLink to='/profile'>Profile</NavLink></li>
                    }
                    {
                        this.props.path === '/logout'
                            ? <li className="active"><NavLink to='/logout'>Logout</NavLink></li>
                            : <li><NavLink to='/logout'>Logout</NavLink></li>
                    }
                </ul>
            </React.Fragment>
        );
    }
}

export default Customer;