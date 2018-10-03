import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

class Navigation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            path: this.props.path,
            authenticated: this.props.authenticated,
            role: this.props.role,
        }
    }

    componentDidMount() {
        console.log(this.state);
    }

    render() {
        const count = this.props.cart.length;
        const { path, authenticated, role } = this.state;
        if(authenticated && role == 1) {
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
                        <ul className="nav navbar-nav navbar-right">
                            {
                                path === '/orders'
                                    ? <li className="active"><NavLink to='/orders'>Orders</NavLink></li>
                                    : <li><NavLink to='/orders'>Orders</NavLink></li>
                            }
                            {
                                path === '/profile'
                                    ? <li className="active"><NavLink to='/profile'>Profile</NavLink></li>
                                    : <li><NavLink to='/profile'>Profile</NavLink></li>
                            }
                            {
                                path === '/logout'
                                    ? <li className="active"><NavLink to='/logout'>Logout</NavLink></li>
                                    : <li><NavLink to='/logout'>Logout</NavLink></li>
                            }
                        </ul>
                        </div>
                    </div>
                </nav>
            );
        } else if(authenticated && role == 3) {
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
                        <ul className="nav navbar-nav navbar-right">
                            {
                                path === '/products'
                                    ? <li className="active"><NavLink to='/products'>Products</NavLink></li>
                                    : <li><NavLink to='/products'>Products</NavLink></li>
                            }
                            {
                                path === '/orders'
                                    ? <li className="active"><NavLink to='/orders'>Orders</NavLink></li>
                                    : <li><NavLink to='/orders'>Orders</NavLink></li>
                            }
                            {
                                path === '/menu'
                                    ? <li className="active"><NavLink to='/menu'>Menu</NavLink></li>
                                    : <li><NavLink to='/menu'>Menu</NavLink></li>
                            }
                            {
                                path === '/roles'
                                    ? <li className="active"><NavLink to='/roles'>Roles</NavLink></li>
                                    : <li><NavLink to='/roles'>Roles</NavLink></li>
                            }
                            {
                                path === '/profile'
                                    ? <li className="active"><NavLink to='/profile'>Profile</NavLink></li>
                                    : <li><NavLink to='/profile'>Profile</NavLink></li>
                            }
                            {
                                path === '/logout'
                                    ? <li className="active"><NavLink to='/logout'>Logout</NavLink></li>
                                    : <li><NavLink to='/logout'>Logout</NavLink></li>
                            }
                        </ul>
                        </div>
                    </div>
                </nav>
            );
        } else {
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
                        <a className="navbar-brand" href="/">React Store</a>
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
                        <ul className="nav navbar-nav navbar-right">
                            {
                                path === '/contact'
                                    ? <li className="active"><NavLink to='/contact'>Contact</NavLink></li>
                                    : <li><NavLink to='/contact'>Contact</NavLink></li>
                            }
                            {
                                path === '/register'
                                    ? <li className="active"><NavLink to='/register'>Register</NavLink></li>
                                    : <li><NavLink to='/register'>Register</NavLink></li>
                            }
                            {
                                path === '/login'
                                    ? <li className="active"><NavLink to='/login'>Login</NavLink></li>
                                    : <li><NavLink to='/login'>Login</NavLink></li>
                            }
                        </ul>
                        </div>
                    </div>
                </nav>
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        cart: state.cart
    }
}

export default connect(mapStateToProps)(Navigation)