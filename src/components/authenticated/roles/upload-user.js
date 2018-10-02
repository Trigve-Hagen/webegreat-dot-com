import React from 'react';
import { connect } from 'react-redux';
import config from '../../../config/config';

class UploadUser extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
            userUploadError: '',
            userUploadRole: '',
            userUploadName: '',
            userUploademail: '',
            userUploadAddress: '',
            userUploadCity: '',
            userUploadState: '',
            userUploadZip: '',
            userUploadPassword: '',
            uploadInput: '',
            fileName: ''
		}

		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(e) {
		e.preventDefault();
        
        const data = new FormData();
            data.append('file', this.state.uploadInput.files[0]);
            data.append('filename', this.state.fileName.value);
            data.append('role', this.state.userUploadRole.value);
            data.append('name', this.state.userUploadName.value);
            data.append('email', this.state.userUploademail.value);
            data.append('address', this.state.userUploadAddress.value);
			data.append('city', this.state.userUploadCity.value);
            data.append('state', this.state.userUploadState.value);
            data.append('zip', this.state.userUploadZip.value);
            data.append('password', this.state.userUploadPassword.value);
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
                        address: json.price,
                        city: json.stock,
                        state: json.ifmanaged,
                        zip: json.description,
                        image: json.image,
                        password: json.password
                    });
					this.setState({
                        userUploadError: json.message,
                        userUploadRole: '',
                        userUploadName: '',
                        userUploademail: '',
                        userUploadAddress: '',
                        userUploadCity: '',
                        userUploadState: '',
                        userUploadZip: '',
                        userUploadPassword: '',
                        uploadInput: '',
                        fileName: ''
                    });
				} else {
                    this.setState({
						userUploadError: json.message
					});
                }
			});
	}

    render() {
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
                        <form name="proUpload" onSubmit={this.onSubmit}>
                            <fieldset className="form-group">
                                <input ref={(ref) => { this.state.uploadInput = ref; }} type="file" className="form-control-file btn btn-army"/>
                            </fieldset>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                                <fieldset className="form-group">
                                    <input ref={(ref) => { this.state.fileName = ref; }} type="text" className="form-element" placeholder="desired-name-of-file" />
                                </fieldset>
                                <fieldset className="form-group">
                                    <input ref={(ref) => { this.state.userUploadRole = ref; }} type="text" className="form-element" placeholder="User Role"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input ref={(ref) => { this.state.userUploadName = ref; }} type="text" className="form-element" placeholder="Name"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input ref={(ref) => { this.state.userUploademail = ref; }} type="email" className="form-element" placeholder="Email"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input ref={(ref) => { this.state.userUploadAddress = ref; }} type="text" className="form-element" placeholder="Address"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input ref={(ref) => { this.state.userUploadCity = ref; }} type="text" className="form-element" placeholder="City"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input ref={(ref) => { this.state.userUploadState = ref; }} type="text" className="form-element" placeholder="State"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input ref={(ref) => { this.state.userUploadZip = ref; }} type="text" className="form-element" placeholder="Zip"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input ref={(ref) => { this.state.userUploadPassword = ref; }} type="password" className="form-element" placeholder="Password"/>
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