import React from 'react';
import { connect } from 'react-redux';
import config from '../../../config/config';

class UpdateProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profileError: '',
            profileName: '',
            profileEmail: '',
            profileAddress: '',
            profileCity: '',
            profileState: '',
            profileZip: ''
        }
        this.onSubmit = this.onSubmit.bind(this);
    }

	onSubmit(e) {
		e.preventDefault();

        const data = new FormData();
            data.append('name', this.state.profileName.value);
            data.append('email', this.state.profileEmail.value);
            data.append('address', this.state.profileAddress.value);
            data.append('city', this.state.profileCity.value);
            data.append('state', this.state.profileState.value);
            data.append('zip', this.state.profileZip.value);
            data.append('token', this.props.authentication[0].token);

		fetch(config.site_url + '/api/profile/update-profile', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    console.log("Profile update successfull.");
					this.setState({
                        profileError: json.message,
                        profileName: json.name,
                        profileEmail: json.email,
                        profileAddress: json.address,
                        profileCity: json.city,
                        profileState: json.state,
                        profileZip: json.zip
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
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                                <div className="form-group">
                                    <input ref={(ref) => { this.state.profileName = ref; }} type="text" className="form-element" id="profileName" placeholder="Full Name" />
                                </div>
                                <div className="form-group">
                                    <input ref={(ref) => { this.state.profileEmail = ref; }} type="email" className="form-element" id="profileEmail" placeholder="Email Address" />
                                </div>
                                <div className="form-group">
                                    <input ref={(ref) => { this.state.profileAddress = ref; }} type="text" className="form-element" id="profileAddress" placeholder="Address" />
                                </div>
                                <div className="form-group">
                                    <input ref={(ref) => { this.state.profileCity = ref; }} type="text" className="form-element" id="profileCity" placeholder="City" />
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-24">
                                <div className="form-group">
                                    <select ref={ (ref) => { this.state.profileState = ref; }} className="form-element custom">
                                        {config.states.map(state => <option key={state.abrev} value={state.abrev}>{state.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-24">
                                <div className="form-group">
                                    <input ref={(ref) => { this.state.profileZip = ref; }} type="text" className="form-element" id="profileZip" placeholder="Zip" />
                                </div>
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