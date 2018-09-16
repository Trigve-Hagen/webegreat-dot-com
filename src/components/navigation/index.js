import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

class Navigation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            path: '',
        }
    }

    componentDidMount() {
        this.props.updatePath(window.location.pathname);
        this.setState({ path: window.location.pathname });
    }

    render() {
        const count = this.props.cart.length;
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
                            window.location.pathname === '/'
                                ? <li className="active"><NavLink to='/'>Home</NavLink></li>
                                : <li><NavLink to='/'>Home</NavLink></li>
                        }
                        {
                            window.location.pathname === '/about'
                                ? <li className="active"><NavLink to='/about'>About</NavLink></li>
                                : <li><NavLink to='/about'>About</NavLink></li>
                        }
                        {
                            count > 0 ?
                                window.location.pathname === '/cart'
                                    ? <li className="active"><NavLink to='/cart'><span className="glyphicon glyphicon-shopping-cart"></span></NavLink></li>
                                    : <li><NavLink to='/cart'><span className="glyphicon glyphicon-shopping-cart"></span> <span></span></NavLink></li>
                            : null
                        } 
                    </ul>
                    <ul className="nav navbar-nav navbar-right">
                        {
                            window.location.pathname === '/contact'
                                ? <li className="active"><NavLink to='/contact'>Contact</NavLink></li>
                                : <li><NavLink to='/contact'>Contact</NavLink></li>
                        }
                        {
                            window.location.pathname === '/register'
                                ? <li className="active"><NavLink to='/register'>Register</NavLink></li>
                                : <li><NavLink to='/register'>Register</NavLink></li>
                        }
                        {
                            window.location.pathname === '/login'
                                ? <li className="active"><NavLink to='/login'>Login</NavLink></li>
                                : <li><NavLink to='/login'>Login</NavLink></li>
                        }
                    </ul>
                    </div>
                </div>
            </nav>
        )
    }
}

function mapStateToProps(state) {
    return {
        cart: state.cart,
        navigation: state.navigation
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updatePath: (value) => {
            dispatch( { type: 'UPDATE_PATH', payload: value} )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)