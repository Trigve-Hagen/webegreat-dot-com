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
        this.onSubmit = this.onSubmit.bind(this);
    }

	onSubmit(e) {
		e.preventDefault();

        const data = new FormData();
            data.append('name', this.state.profileName);
            data.append('email', this.state.profileEmail);
            data.append('token', this.props.authentication[0].token);

		fetch('http://localhost:4000/api/profile/update-profile', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    console.log("Profile update successfull.");
					this.setState({
                        profileError: json.message,
                        profileName: json.name,
                        profileEmail: json.email
                    });
				} else {
                    this.setState({
						profileError: json.message
					});
                }
			});
    }

    render() {
        return (
            <div>
                <div className="row space-top-50px">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        <h3>Update Profile</h3>
                        {
                            (this.state.profileError) ? (
                                <label>{this.state.profileError}</label>
                            ) : (null)
                        }
                        <form className="updateProfile" onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <input ref={(ref) => { this.state.profileName = ref; }} type="text" className="form-element" placeholder="Full Name" />
                            </div>
                            <div className="form-group">
                                <input ref={(ref) => { this.state.profileEmail = ref; }} type="email" className="form-element" placeholder="Email Address" />
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