import React from 'react';
import { NavLink } from 'react-router-dom';

class Admin extends React.Component {
    render() {
        return (
            <React.Fragment>
                <ul className="nav navbar-nav navbar-right">
                    {
                        this.props.path === '/products'
                            ? <li className="active"><NavLink to='/products'>Products</NavLink></li>
                            : <li><NavLink to='/products'>Products</NavLink></li>
                    }
                    {
                        this.props.path === '/customer-orders'
                            ? <li className="active"><NavLink to='/customer-orders'>My Orders</NavLink></li>
                            : <li><NavLink to='/customer-orders'>My Orders</NavLink></li>
                    }
                    {
                        this.props.path === '/merchant-orders'
                            ? <li className="active"><NavLink to='/merchant-orders'>Merchant Orders</NavLink></li>
                            : <li><NavLink to='/merchant-orders'>Merchant Orders</NavLink></li>
                    }
                    {
                        this.props.path === '/menu'
                            ? <li className="active"><NavLink to='/menu'>Menu</NavLink></li>
                            : <li><NavLink to='/menu'>Menu</NavLink></li>
                    }
                    {
                        this.props.path === '/roles'
                            ? <li className="active"><NavLink to='/roles'>Roles</NavLink></li>
                            : <li><NavLink to='/roles'>Roles</NavLink></li>
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

export default Admin;