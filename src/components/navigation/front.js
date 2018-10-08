import React from 'react';
import { NavLink } from 'react-router-dom';

class Front extends React.Component {
    render() {
        return (
            <React.Fragment>
                <ul className="nav navbar-nav navbar-right">
                    {
                        this.props.path === '/contact'
                            ? <li className="active"><NavLink to='/contact'>Contact</NavLink></li>
                            : <li><NavLink to='/contact'>Contact</NavLink></li>
                    }
                    {
                        this.props.path === '/register'
                            ? <li className="active"><NavLink to='/register'>Register</NavLink></li>
                            : <li><NavLink to='/register'>Register</NavLink></li>
                    }
                    {
                        this.props.path === '/login'
                            ? <li className="active"><NavLink to='/login'>Login</NavLink></li>
                            : <li><NavLink to='/login'>Login</NavLink></li>
                    }
                </ul>
            </React.Fragment>
        );
    }
}

export default Front;