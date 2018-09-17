import React from 'react';
import config from '../../config/config'

class Register extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
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
					this.setState({
						registerError: json.message
					});
					//const now = new Date();
					//const regex1 = RegExp('localhost'); let siteUrl = '';
					//console.log(window.location.href + ", " + regex1.test(window.location.href));
                    //if(regex1.test(window.location.href)) siteUrl = config.site_url_dev; else siteUrl = config.site_url;
                    // eslint-disable-next-line
                    //window.location = siteUrl + '/check?success=casino' + '&token=' + json.token + '&id=' + json.id + '&created=' + now;
				} else {
                    this.setState({
						registerError: json.message
					});
                }
			});
	}

    render() {
        const { registerEmail, registerError, registerName, registerPassword } = this.state;
        return (
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
        )
    }
}

export default Register;