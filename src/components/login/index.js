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
            loginRedirect: false
		}
		this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
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
        const { loginError, loginEmail, loginPassword, loginRedirect } = this.state;
        if(loginRedirect) return <Redirect to='/profile' />;
        return (
            <div>
                <Navigation path="/login" authenticated={this.props.authentication[0].authenticated}/>
                <div className="container">
                    <div className="row space-top-20px space-bottom-50px">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
							<h1>Login</h1>
							<div className="row">
                                <div className="col-lg-2 col-md-2 col-sm-12 col-xs-24">
                                </div>
                                <div className="col-lg-8 col-md-8 col-sm-12 col-xs-24">
                                    <form name="login" onSubmit={this.onSubmit}>
                                        {
                                            (loginError) ? (
                                                <label>{loginError}</label>
                                            ) : (null)
                                        }
                                        <fieldset className="form-group">
                                            <input type="text" value={loginEmail} onChange={this.onChange} name="loginEmail" className="form-element" id="loginEmail" placeholder="Email"/>
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <input type="password" value={loginPassword} onChange={this.onChange} name="loginPassword" className="form-element" id="loginPassword" placeholder="Password"/>
                                        </fieldset>
                                        <button type="submit" className="btn btn-army" >Login</button>
                                    </form>
                                </div>
                                <div className="col-lg-2 col-md-2 col-sm-12 col-xs-24">
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