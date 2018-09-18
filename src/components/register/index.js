import React from 'react';
import config from '../../config/config';
import { connect } from 'react-redux';
import Navigation from '../navigation';

class Register extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
			path: '/register',
			authenticated: this.props.authentication[0].authenticated,
			redirect: false,
			registerError: '',
			registerName: '',
			registerEmail: '',
			registerPassword: ''
		}

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value});
	}

	onSubmit(e) {
		e.preventDefault();
		console.log(this.state);
		const {
			registerName,
			registerEmail,
			registerPassword
		} = this.state;

		fetch('http://localhost:4000/api/account/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: registerName,
				email: registerEmail,
				password: registerPassword
			})
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
					console.log("Successfull Registration.");
					this.props.updateAuth({ authenticated: true, token: json.token });
					this.setState({
						redirect: true,
						registerError: json.message,
					});
					
				} else {
                    this.setState({
						registerError: json.message
					});
                }
			});
	}

    render() {
		const {
			path,
			redirect,
			registerEmail,
			registerError,
			registerName,
			registerPassword,
			authenticated
		} = this.state;
		if(redirect) return <Redirect to='/profile' />
        return (
			<div>
				<Navigation path={path} authenticated={authenticated} />
				<div className="container">
					<div className="row">
						<div className="col-lg-2 col-md-2 col-sm-12 col-xs-24">
						</div>
						<div className="col-lg-8 col-md-8 col-sm-12 col-xs-24">
						<h3>Register</h3>
							{
								(registerError) ? (
									<label>{registerError}</label>
								) : (null)
							}
							<form name="register" onSubmit={this.onSubmit}>
								<fieldset className="form-group">
									<input value={registerName} onChange={this.onChange} type="text" name="registerName" className="form-element" id="registerName" placeholder="Full Name"/>
								</fieldset>
								<fieldset className="form-group">
									<input value={registerEmail} onChange={this.onChange} type="email" name="registerEmail" className="form-element" id="registerEmail" placeholder="someone@somewhere.com"/>
								</fieldset>
								<fieldset className="form-group">
									<input value={registerPassword} onChange={this.onChange} type="password" name="registerPassword" className="form-element" id="registerPassword" placeholder="Password"/>
								</fieldset>
								<button type="submit" className="btn btn-army">Register</button>
							</form>
						</div>
						<div className="col-lg-2 col-md-2 col-sm-12 col-xs-24">
						</div>
					</div>
				</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Register);