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
        this.onSubmit = this.onSubmit.bind(this);
    }

	onSubmit(e) {
		e.preventDefault();

        const data = new FormData();
            data.append('password', this.state.password.value);
            data.append('repassword', this.state.rePassword.value);
            data.append('token', this.props.authentication[0].token);

		fetch('http://localhost:4000/api/profile/update-password', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
					console.log("Avatar update successfull.");
					this.setState({
                        passwordError: json.message,
                        password: json.password,
                        rePassword: json.repassword
                    });
				} else {
                    this.setState({
						passwordError: json.message
					});
                }
			});
    }

    render() {
        return (
            <div>
                <div className="row space-top-20px">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        <h3>Update Password</h3>
                        {
                            (this.state.passwordError) ? (
                                <label>{this.state.passwordError}</label>
                            ) : (null)
                        }
                        <form className="updatePassword" onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <input ref={(ref) => { this.state.password = ref; }} type="text" className="form-element" id="password" placeholder="Password" />
                            </div>
                            <div className="form-group">
                                <input ref={(ref) => { this.state.rePassword = ref; }} type="text" className="form-element" id="rePassword" placeholder="Re-Password" />
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