import React from 'react';
import { NavLink } from 'react-router-dom';

class Front extends React.Component {
    render() {
        return (
            <React.Fragment>
                <ul className="nav navbar-nav navbar-right">
                    {
                        this.props.path === '/contact'
                            ? <li className="nav-item active"><NavLink className="nav-link" to='/contact'>Contact</NavLink></li>
                            : <li className="nav-item"><NavLink className="nav-link" to='/contact'>Contact</NavLink></li>
                    }
                    {
                        this.props.path === '/register'
                            ? <li className="nav-item active"><NavLink className="nav-link" to='/register'>Register</NavLink></li>
                            : <li className="nav-item"><NavLink className="nav-link" to='/register'>Register</NavLink></li>
                    }
                    {
                        this.props.path === '/login'
                            ? <li className="nav-item active"><NavLink className="nav-link" to='/login'>Login</NavLink></li>
                            : <li className="nav-item"><NavLink className="nav-link" to='/login'>Login</NavLink></li>
                    }
                </ul>
            </React.Fragment>
        );
    }
}

export default Front;