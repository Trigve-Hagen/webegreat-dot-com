import React from 'react';
import { connect } from 'react-redux';
import config from '../../../config/config';
import states from '../../../data/states';

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
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
    }

    componentDidMount() {
        fetch(config.site_url + '/api/account/get-account', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				token: this.props.authentication[0].token
			})
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
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

	onSubmit(e) {
		e.preventDefault();

        const data = new FormData();
            data.append('name', this.state.profileName);
            data.append('email', this.state.profileEmail);
            data.append('address', this.state.profileAddress);
            data.append('city', this.state.profileCity);
            data.append('state', this.state.profileState);
            data.append('zip', this.state.profileZip);
            data.append('token', this.props.authentication[0].token);

		fetch(config.site_url + '/api/profile/update-profile', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
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
                <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <h3>Update Profile</h3>
                        {
                            (this.state.profileError) ? (
                                <label>{this.state.profileError}</label>
                            ) : (null)
                        }
                        <form className="updateProfile" onSubmit={this.onSubmit}>
                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                <div className="form-group">
                                    <input value={this.state.profileName} onChange={this.onChange} type="text" className="form-element" name="profileName" placeholder="Full Name" />
                                </div>
                                <div className="form-group">
                                    <input value={this.state.profileEmail} onChange={this.onChange} type="email" className="form-element" name="profileEmail" placeholder="Email Address" />
                                </div>
                                <div className="form-group">
                                    <input value={this.state.profileAddress} onChange={this.onChange} type="text" className="form-element" name="profileAddress" placeholder="Address" />
                                </div>
                                <div className="form-group">
                                    <input value={this.state.profileCity} onChange={this.onChange} type="text" className="form-element" name="profileCity" placeholder="City" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                    <div className="form-group">
                                        <select value={this.state.profileState} onChange={this.onChange} className="form-element custom" name="profileState">
                                            {states.map(state => <option key={state.abrev} value={state.abrev}>{state.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                    <div className="form-group">
                                        <input value={this.state.profileZip} onChange={this.onChange} type="text" className="form-element" name="profileZip" placeholder="Zip" />
                                    </div>
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