import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Navigation from '../navigation';
import Footer from '../footer';
import config from '../../config/config';

class Register extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
			redirect: false,
			registerError: '',
			registerName: '',
			registerEmail: '',
			registerPassword: '',
			windowHeight: 0,
            footerHeight: 0,
            menuHeight: 0
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
		this.setState({ [e.target.name]: e.target.value });
	}

	onSubmit(e) {
		e.preventDefault();
		console.log(this.state);
		const {
			registerName,
			registerEmail,
			registerPassword
		} = this.state;

		fetch(config.site_url + '/api/account/signup', {
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
					this.props.updateAuth({ authenticated: true, token: json.token, role: 1 });
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
		let containerHeight = this.state.windowHeight - (this.state.menuHeight + this.state.footerHeight);
		if(this.state.redirect) return <Redirect to='/profile' />
        return (
			<div>
				<Navigation path="/register" />
				<div
                    className="container"
                    style={{
                        minHeight: containerHeight + 'px'
                    }}
                >
					<div className="row">
						<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
							<h1 className="mt-3">Register</h1>
							<div className="row mb-3">
								<div className="col-xl-2 col-lg-2 col-md-2 col-sm-12">
								</div>
								<div className="col-xl-8 col-lg-8 col-md-8 col-sm-12">
									{
										(this.state.registerError) ? (
											<label>{this.state.registerError}</label>
										) : (null)
									}
									<form name="register" onSubmit={this.onSubmit}>
										<fieldset className="form-group">
											<input value={this.state.registerName} onChange={this.onChange} type="text" name="registerName" className="form-element" id="registerName" placeholder="Full Name"/>
										</fieldset>
										<fieldset className="form-group">
											<input value={this.state.registerEmail} onChange={this.onChange} type="email" name="registerEmail" className="form-element" id="registerEmail" placeholder="someone@somewhere.com"/>
										</fieldset>
										<fieldset className="form-group">
											<input value={this.state.registerPassword} onChange={this.onChange} type="password" name="registerPassword" className="form-element" id="registerPassword" placeholder="Password"/>
										</fieldset>
										<button type="submit" className="btn btn-army">Register</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Register);