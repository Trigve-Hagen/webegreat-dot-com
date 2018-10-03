import React from 'react';
import { connect } from 'react-redux';
import config from '../../../config/config';

class UpdateUser extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
            userUpdateError: '',
            userUpdateRole: '',
            userUpdateName: '',
            userUpdateemail: '',
            userUpdateAddress: '',
            userUpdateCity: '',
            userUpdateState: '',
            userUpdateZip: '',
            userUpdateIfActive: '',
            userUpdatePassword: '',
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
            data.append('role', this.state.userUpdateRole.value);
            data.append('name', this.state.userUpdateName.value);
            data.append('email', this.state.userUpdateemail.value);
            data.append('address', this.state.userUpdateAddress.value);
			data.append('city', this.state.userUpdateCity.value);
            data.append('state', this.state.userUpdateState.value);
            data.append('zip', this.state.userUpdateZip.value);
            data.append('ifactive', this.state.userUpdateIfActive.value);
            data.append('password', this.state.userUpdatePassword.value);
            data.append('token', this.props.authentication[0].token);

		fetch(config.site_url + '/api/roles/user-update', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
					console.log("User update successfull.");
					this.props.updateRole({
                        id: json.id,
                        role : json.role,
                        name: json.name,
                        email: json.email,
                        address: json.price,
                        city: json.stock,
                        state: json.ifmanaged,
                        zip: json.description,
                        ifactive: json.ifactive,
                        image: json.image,
                        password: json.password
                    });
					this.setState({
                        userUpdateError: json.message,
                        userUpdateRole: '',
                        userUpdateName: '',
                        userUpdateemail: '',
                        userUpdateAddress: '',
                        userUpdateCity: '',
                        userUpdateState: '',
                        userUpdateZip: '',
                        userUpdateIfActive: '',
                        userUpdatePassword: '',
                        uploadInput: '',
                        fileName: ''
                    });
				} else {
                    this.setState({
						userUpdateError: json.message
					});
                }
			});
	}

    render() {
        return (
			<div>
                <h3>User Update</h3>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        {
                            (this.state.userUpdateError) ? (
                                <label>{this.state.userUpdateError}</label>
                            ) : (null)
                        }
                        <form name="userUpdate" onSubmit={this.onSubmit}>
                            <fieldset className="form-group">
                                <input ref={(ref) => { this.state.uploadInput = ref; }} type="file" className="form-control-file btn btn-army"/>
                            </fieldset>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                                <fieldset className="form-group">
                                    <input ref={(ref) => { this.state.fileName = ref; }} type="text" className="form-element" placeholder="desired-name-of-file" />
                                </fieldset>
                                <div className="form-group">
                                    <select ref={ (ref) => { this.state.userUpdateRole = ref; }} name="userUpdateRole" className="form-element custom">
                                        <option value="1">Customer</option>
                                        <option value="2">Employee</option>
                                        <option value="3">Administator</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <select ref={ (ref) => { this.state.userUpdateIfActive = ref; }} name="userUpdateIfActive" className="form-element custom">
                                        <option value="0">Account Inactive</option>
                                        <option value="1">Account Active</option>
                                    </select>
                                </div>
                                <fieldset className="form-group">
                                    <input ref={(ref) => { this.state.userUpdateName = ref; }} type="text" className="form-element" placeholder="Name"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input ref={(ref) => { this.state.userUpdateemail = ref; }} type="email" className="form-element" placeholder="Email"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input ref={(ref) => { this.state.userUpdatePassword = ref; }} type="password" className="form-element" placeholder="Password"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input ref={(ref) => { this.state.userUpdateAddress = ref; }} type="text" className="form-element" placeholder="Address"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input ref={(ref) => { this.state.userUpdateCity = ref; }} type="text" className="form-element" placeholder="City"/>
                                </fieldset>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-24">
                                <div className="form-group">
                                    <select ref={ (ref) => { this.state.userUpdateState = ref; }} className="form-element custom">
                                        {config.states.map(state => <option key={state.abrev} value={state.abrev}>{state.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-24">
                                <fieldset className="form-group">
                                    <input ref={(ref) => { this.state.userUpdateZip = ref; }} type="text" className="form-element" placeholder="Zip"/>
                                </fieldset>
                            </div>
                            <button type="submit" className="btn btn-army">User Update</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(UpdateUser);