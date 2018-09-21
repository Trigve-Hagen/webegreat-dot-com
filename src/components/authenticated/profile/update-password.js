import React from 'react';
import { connect } from 'react-redux';

class UpdatePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            passwordError: '',
            password: '',
            rePassword: '',
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
            password,
            rePassword
		} = this.state;

		fetch('http://localhost:4000/api/account/upload-image', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
                password: password,
                rePassword: rePassword
			})
		}).then(res => res.json())
			.then(json => {
				/*if(json.success) {
                    console.log("Successfull SignIn." + json.token);
					this.props.updateAuth({ authenticated: true, token: json.token });
					this.setState({
                        loginError: json.message,
                        loginRedirect: true
					});
                    
				} else {
                    this.setState({
						loginError: json.message
					});
                }*/
			});
    }

    render() {
        const { password, rePassword, passwordError } = this.state;
        return (
            <div>
                <div className="row space-top-20px">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        <h3>Update Password</h3>
                        {
                            (passwordError) ? (
                                <label>{passwordError}</label>
                            ) : (null)
                        }
                        <form className="updatePassword" onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <input type="text" value={password} onChange={this.onChange} className="form-element" id="password" placeholder="Password" />
                            </div>
                            <div className="form-group">
                                <input type="text" value={rePassword} onChange={this.onChange} className="form-element" id="rePassword" placeholder="Re-Password" />
                            </div>
                            <button type="submit" className="btn btn-army">Update Password</button>
                        </form>
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

export default connect(mapStateToProps)(UpdatePassword)