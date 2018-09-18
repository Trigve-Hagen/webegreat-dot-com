import React from 'react';
import config from '../../config/config'

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
			loginEmail: '',
            loginPassword: '',
            loginError: ''
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

		fetch('http://localhost:4000/api/account/signin', {
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
                    console.log("Successfull SignIn.");
					this.setState({
						loginError: json.message
					});
                    //const now = new Date();
                    //const regex1 = RegExp('localhost'); let siteUrl = '';
					//console.log(window.location.href + ", " + regex1.test(window.location.href));
                    //if(regex1.test(window.location.href)) siteUrl = config.site_url_dev; else siteUrl = config.site_url;
                    // eslint-disable-next-line
                    //window.location = siteUrl + '/check?success=casino' + '&token=' + json.token + '&id=' + json.id + '&created=' + now;
                    //window.location = config.site_url + '/check?success=casino' + '&token=' + json.token + '&id=' + json.id + '&created=' + now;
				} else {
                    this.setState({
						loginError: json.message
					});
                }
			});
    }

    render() {
        const { loginError, loginEmail, loginPassword } = this.state;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-lg-2 col-md-2 col-sm-12 col-xs-24">
                    </div>
                    <div className="col-lg-8 col-md-8 col-sm-12 col-xs-24">
                        <form name="login" onSubmit={this.onSubmit}>
                            <h3>Login</h3>
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
        )
    }
}

export default Login;