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
            <nav className="navbar navbar-inverse navbar-static-top">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="/">React Admin</a>
                    </div>
            
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav">
                            {
                                path === '/'
                                    ? <li className="active"><NavLink to='/'>Home</NavLink></li>
                                    : <li><NavLink to='/'>Home</NavLink></li>
                            }
                            {
                                path === '/about'
                                    ? <li className="active"><NavLink to='/about'>About</NavLink></li>
                                      : <li><NavLink to='/about'>About</NavLink></li>
                            }
                            {
                                count > 0 ?
                                    path === '/cart'
                                        ? <li className="active"><NavLink to='/cart'><span className="glyphicon glyphicon-shopping-cart"></span></NavLink></li>
                                        : <li><NavLink to='/cart'><span className="glyphicon glyphicon-shopping-cart"></span> <span></span></NavLink></li>
                                : null
                            } 
                        </ul>
                        {fragment}
                    </div>
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