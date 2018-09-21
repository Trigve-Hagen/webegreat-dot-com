import React from 'react';
import { connect } from 'react-redux';

class UpdateProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profileError: '',
            profileName: '',
            profileEmail: ''
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
            profileName,
            profileEmail
		} = this.state;

		fetch('http://localhost:4000/api/account/upload-image', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
                name: profileName,
                email: profileEmail
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
        const { profileName, profileEmail, profileError } = this.state;
        return (
            <div>
                <div className="row space-top-50px">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        <h3>Update Profile</h3>
                        {
                            (profileError) ? (
                                <label>{profileError}</label>
                            ) : (null)
                        }
                        <form className="checkPaypal" onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <input type="text" value={profileName} onChange={this.onChange} className="form-element" id="name" placeholder="Full Name" />
                            </div>
                            <div className="form-group">
                                <input type="email" value={profileEmail} onChange={this.onChange} className="form-element" id="email" placeholder="Email Address" />
                            </div>
                            <button type="submit" className="btn btn-army">Update Profile</button>
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

export default connect(mapStateToProps)(UpdateProfile)