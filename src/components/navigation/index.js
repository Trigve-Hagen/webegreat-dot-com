import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import Admin from './admin';
import Customer from './customer';
import Front from './front';

class Navigation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            path: this.props.path,
            authenticated: this.props.authenticated,
            role: this.props.role,
        }
    }

    render() {
        const count = this.props.cart.length;
        const { path, authenticated, role } = this.state;
        let fragment = '';
        if(authenticated && role == 1) fragment = <Customer path={path} />;
        else if(authenticated && role == 2) fragment = <Customer path={path} />;
        else if(authenticated && role == 3) fragment = <Admin path={path} />;
        else fragment = <Front path={path} />
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <a className="navbar-brand" href="/">React</a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        {
                            path === '/store'
                                ? <li className="nav-item active"><NavLink className="nav-link active" to='/store'>Store</NavLink></li>
                                    : <li className="nav-item"><NavLink className="nav-link" to='/store'>Store</NavLink></li>
                        }
                        {
                            path === '/about'
                                ? <li className="nav-item active"><NavLink className="nav-link active" to='/about'>About</NavLink></li>
                                    : <li className="nav-item"><NavLink className="nav-link" to='/about'>About</NavLink></li>
                        }
                        {
                            count > 0 ?
                                path === '/cart'
                                    ? <li className="nav-item active"><NavLink className="nav-link active" to='/cart'><i className="fa fa-cart-plus fa-spin fa-1x fa-fw"></i></NavLink></li>
                                    : <li className="nav-item"><NavLink className="nav-link" to='/cart'><i className="fa fa-cart-plus fa-spin fa-1x fa-fw"></i><span></span></NavLink></li>
                            : null
                        }
                    </ul>
                    {fragment}
                </div>
            </nav>
        );
    }
}

function mapStateToProps(state) {
    return {
        cart: state.cart
    }
}

export default connect(mapStateToProps)(Navigation)