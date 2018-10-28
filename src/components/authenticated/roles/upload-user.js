import React from 'react';
import { connect } from 'react-redux';
import config from '../../../config/config';
import states from '../../../data/states';

class UploadUser extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
            userUploadError: '',
            userUploadRole: '',
            userUploadName: '',
            userUploadEmail: '',
            userUploadAddress: '',
            userUploadCity: '',
            userUploadState: '',
            userUploadZip: '',
            userUploadIfActive: '',
            userUploadPassword: ''
		}
        this.onChange= this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
    }
    
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

	onSubmit(e) {
		e.preventDefault();
        
        const data = new FormData();
            data.append('role', this.state.userUploadRole);
            data.append('name', this.state.userUploadName);
            data.append('email', this.state.userUploadEmail);
            data.append('address', this.state.userUploadAddress);
			data.append('city', this.state.userUploadCity);
            data.append('state', this.state.userUploadState);
            data.append('zip', this.state.userUploadZip);
            data.append('ifactive', this.state.userUploadIfActive);
            data.append('password', this.state.userUploadPassword);
            data.append('token', this.props.authentication[0].token);

		fetch(config.site_url + '/api/roles/upload', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
					console.log("User upload successfull.");
					this.props.updateRole({
                        id: json.id,
                        role : json.role,
                        name: json.name,
                        email: json.email,
                        address: json.address,
                        city: json.city,
                        state: json.state,
                        zip: json.zip,
                        ifactive: json.ifactive,
                        image: 'user-avatar.jpg'
                    });
					this.setState({
                        userUploadError: json.message,
                        userUploadRole: '',
                        userUploadName: '',
                        userUploadEmail: '',
                        userUploadAddress: '',
                        userUploadCity: '',
                        userUploadState: '',
                        userUploadZip: '',
                        userUploadIfActive: '',
                        userUploadPassword: ''
                    });
				} else {
                    this.setState({
						userUploadError: json.message
					});
                }
			});
	}

    render() {
        //this.props.resetRole();
        return (
			<div>
                <h3>User Upload</h3>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        {
                            (this.state.userUploadError) ? (
                                <label>{this.state.userUploadError}</label>
                            ) : (null)
                        }
                        <form name="userUpload" onSubmit={this.onSubmit}>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                                <div className="form-group">
                                    <select value={this.state.userUploadRole} onChange={this.onChange} name="userUploadRole" className="form-element custom">
                                        <option value="">Please select a value.</option>
                                        <option value="1">Customer</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <select value={this.state.userUploadIfActive} onChange={this.onChange} name="userUploadIfActive" className="form-element custom">
                                        <option value="">Please select a value.</option>
                                        <option value="0">Account Inactive</option>
                                        <option value="1">Account Active</option>
                                    </select>
                                </div>
                                <fieldset className="form-group">
                                    <input value={this.state.userUploadName} onChange={this.onChange} name="userUploadName" type="text" className="form-element" placeholder="Name"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input value={this.state.userUploadEmail} onChange={this.onChange} name="userUploadEmail" type="email" className="form-element" placeholder="Email"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input value={this.state.userUploadPassword} onChange={this.onChange} name="userUploadPassword" type="password" className="form-element" placeholder="Password"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input value={this.state.userUploadAddress} onChange={this.onChange} name="userUploadAddress" type="text" className="form-element" placeholder="Address"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input value={this.state.userUploadCity} onChange={this.onChange} name="userUploadCity" type="text" className="form-element" placeholder="City"/>
                                </fieldset>
                                    <div className="form-group">
                                        <select value={this.state.userUploadState} onChange={this.onChange} name="userUploadState" className="form-element custom">
                                            {states.map(state => <option key={state.abrev} value={state.abrev}>{state.name}</option>)}
                                        </select>
                                    </div>
                                <fieldset className="form-group">
                                    <input value={this.state.userUploadZip} onChange={this.onChange} name="userUploadZip" type="text" className="form-element" placeholder="Zip"/>
                                </fieldset>
                            </div>
                            <button type="submit" className="btn btn-army">User Upload</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        role: state.role,
        authentication: state.authentication
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateRole: (value) => {
            dispatch({ type: 'UPDATE_ROLE', payload: value})
        },
        resetRole: (value) => {
            dispatch({ type: 'RESET_ROLE', payload: value})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadUser);