import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Navigation from '../navigation';
import Footer from '../footer';
import config from '../../config/config';

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
			loginEmail: '',
            loginPassword: '',
            loginError: '',
            windowHeight: 0,
            footerHeight: 0,
            menuHeight: 0,
            loginRedirect: false
		}
		this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        let windowHeight = isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight;
        let footerHeight = document.getElementsByClassName('webegreat-footer')[0].clientHeight;
        let menuHeight = document.getElementsByClassName('webegreat-menu')[0].clientHeight;
        this.setState({
            windowHeight: windowHeight,
            footerHeight: footerHeight,
            menuHeight: menuHeight
        });
    }

    onChange(e) {
		this.setState({ [e.target.name]: e.target.value});
	}

	onSubmit(e) {
        e.preventDefault();
        const {
			loginEmail,
            loginPassword,
		} = this.state;

		fetch(config.site_url + '/api/account/signin', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: loginEmail,
				password: loginPassword
			})
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
					this.props.updateAuth({ authenticated: true, token: json.token, role: json.role });
					this.setState({
                        loginError: json.message,
                        loginRedirect: true
					});
				} else {
                    this.setState({
						loginError: json.message
					});
                }
			});
    }

    render() {
        let containerHeight = this.state.windowHeight - (this.state.menuHeight + this.state.footerHeight);
        if(this.state.loginRedirect) return <Redirect to='/profile' />;
        return (
            <div>
                <Navigation path="/login" />
                <div
                    className="container"
                    style={{
                        minHeight: containerHeight + 'px'
                    }}
                >
                    <div className="row">
						<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
							<h1 className="mt-3">Login</h1>
							<div className="row mb-3">
                                <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12">
                                </div>
                                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12">
                                    <form name="login" onSubmit={this.onSubmit}>
                                        {
                                            (this.state.loginError) ? (
                                                <label>{this.state.loginError}</label>
                                            ) : (null)
                                        }
                                        <fieldset className="form-group">
                                            <input type="text" value={this.state.loginEmail} onChange={this.onChange} name="loginEmail" className="form-element" id="loginEmail" placeholder="Email"/>
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <input type="password" value={this.state.loginPassword} onChange={this.onChange} name="loginPassword" className="form-element" id="loginPassword" placeholder="Password"/>
                                        </fieldset>
                                        <button type="submit" className="btn btn-army" >Login</button>
                                    </form>
                                </div>
                                <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        authentication: state.authentication
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateAuth: (value) => {
            dispatch( { type: 'UPDATE_AUTH', payload: value} )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);