import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import Admin from './admin';
import Customer from './customer';
import Front from './front';
import Menu from './menu';
import config from '../../config/config';

class Navigation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            path: this.props.path,
            authenticated: this.props.authenticated,
            role: this.props.role,
            loadMenuItems: [],
            navError: ''
        }
    }

    componentDidMount() {
		fetch(config.site_url + '/api/menu/front', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: this.props.authentication[0].token
			})
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    let arrayArgs = [];
                    for (let value of Object.values(json.menuItems)) {
                        if(value['if_active'] == 1 && value['if_dropdown'] == 1) {
                            arrayArgs.push({
                                id: value['menuid'],
                                name: value['name'],
                                level: value['level'],
                                parent: value['parent'],
                                description: value['description'],
                                ifproduct: value['if_product'],
                                ifactive: value['if_active'],
                                ifdropdown: value['if_dropdown']
                            });
                        }
                    }
                    //console.log(arrayArgs);
                    this.setState({
                        navError: json.message,
                        loadMenuItems: arrayArgs
                    });
				} else {
                    this.setState({
						navError: json.message
					});
                }
			});
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
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark webegreat-menu">
                <a className="navbar-brand" href="/">WebeGreat</a>
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
                            (path === '/store' || path === '/menu') && this.state.loadMenuItems !== []
                                ? <Menu menu={this.state.loadMenuItems} onClick={this.props.onClick} />
                                : <div></div>
                        }
                        {
                            path === '/about'
                                ? <li className="nav-item active"><NavLink className="nav-link active" to='/about'>About</NavLink></li>
                                : <li className="nav-item"><NavLink className="nav-link" to='/about'>About</NavLink></li>
                        }
                        
                    </ul>
                    <ul className="navbar-nav mb-0">
                        {
                            count > 0
                                ? path === '/cart'
                                        ? <li className="nav-item active"><NavLink className="nav-link active" to='/cart'><img src="/img/cart.png" style={{ maxWidth: '50px' }} className="img-fluid"/></NavLink></li>
                                        : <li className="nav-item"><NavLink className="nav-link" to='/cart'><img src="/img/cart.png" style={{ maxWidth: '50px' }} className="img-fluid"/><span></span></NavLink></li>
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
        cart: state.cart,
        authentication: state.authentication
    }
}

export default connect(mapStateToProps)(Navigation)