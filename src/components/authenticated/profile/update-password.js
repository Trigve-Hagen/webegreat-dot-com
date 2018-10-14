import React from 'react';
import { connect } from 'react-redux';
import config from '../../../config/config';

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
        this.setState({ [e.target.name]: e.target.value });
    }

	onSubmit(e) {
		e.preventDefault();

        const data = new FormData();
            data.append('password', this.state.password);
            data.append('repassword', this.state.rePassword);
            data.append('token', this.props.authentication[0].token);

		fetch(config.site_url + '/api/profile/update-password', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
					console.log("Avatar update successfull.");
					this.setState({
                        passwordError: json.message,
                        password: '',
                        rePassword: ''
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
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                                <div className="form-group">
                                    <input value={this.state.password} onChange={this.onChange} type="password" className="form-element" name="password" placeholder="Password" />
                                </div>
                                <div className="form-group">
                                    <input value={this.state.rePassword} onChange={this.onChange} type="password" className="form-element" name="rePassword" placeholder="Re-Password" />
                                </div>
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