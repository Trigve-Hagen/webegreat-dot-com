import React from 'react';
import { NavLink } from 'react-router-dom';

class Admin extends React.Component {
    render() {
        return (
            <React.Fragment>
                <ul className="nav navbar-nav navbar-right">
                    {
                        this.props.path === '/products'
                            ? <li className="nav-item active"><NavLink className="nav-link" to='/products'>Products</NavLink></li>
                            : <li className="nav-item"><NavLink className="nav-link" to='/products'>Products</NavLink></li>
                    }
                    {
                        this.props.path === '/merchant-orders'
                            ? <li className="nav-item active"><NavLink className="nav-link" to='/merchant-orders'>Orders</NavLink></li>
                            : <li className="nav-item"><NavLink className="nav-link" to='/merchant-orders'>Orders</NavLink></li>
                    }
                    {
                        this.props.path === '/menu'
                            ? <li className="nav-item active"><NavLink className="nav-link" to='/menu'>Menu</NavLink></li>
                            : <li className="nav-item"><NavLink className="nav-link" to='/menu'>Menu</NavLink></li>
                    }
                    {
                        this.props.path === '/roles'
                            ? <li className="nav-item active"><NavLink className="nav-link" to='/roles'>Roles</NavLink></li>
                            : <li className="nav-item"><NavLink className="nav-link" to='/roles'>Roles</NavLink></li>
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

export default Admin;