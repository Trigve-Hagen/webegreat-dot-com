import React from 'react';
import { connect } from 'react-redux';
import config from '../../../config/config';

class UpdateUser extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
            userUpdateError: '',
            userUpdateId: this.props.role[0].id,
            userUpdateRole: this.props.role[0].role,
            userUpdateName: this.props.role[0].name,
            userUpdateEmail: this.props.role[0].email,
            userUpdateAddress: this.props.role[0].address,
            userUpdateCity: this.props.role[0].city,
            userUpdateState: this.props.role[0].state,
            userUpdateZip: this.props.role[0].zip,
            userUpdateIfActive: this.props.role[0].ifactive,
            userUpdatePassword: '',
            uploadInput: '',
            fileName: this.props.role[0].image.split(".")[0]
		}
        this.onChange= this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
    }
    
    componentDidUpdate(nextProps) {
        if(nextProps.role[0].id !== this.props.role[0].id) {
            this.setState({
                userUpdateId: this.props.role[0].id,
                userUpdateRole: this.props.role[0].role,
                userUpdateName: this.props.role[0].name,
                userUpdateEmail: this.props.role[0].email,
                userUpdateAddress: this.props.role[0].address,
                userUpdateCity: this.props.role[0].city,
                userUpdateState: this.props.role[0].state,
                userUpdateZip: this.props.role[0].zip,
                userUpdateIfActive: this.props.role[0].ifactive,
                updateInput: '',
                fileName: this.props.role[0].image.split(".")[0]
            });
        }
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

	onSubmit(e) {
		e.preventDefault();
        
        const data = new FormData();
            data.append('file', this.state.uploadInput.files[0]);
            data.append('filename', this.state.fileName);
            data.append('id', this.props.role[0].id);
            data.append('role', this.state.userUpdateRole);
            data.append('name', this.state.userUpdateName);
            data.append('email', this.state.userUpdateEmail);
            data.append('address', this.state.userUpdateAddress);
			data.append('city', this.state.userUpdateCity);
            data.append('state', this.state.userUpdateState);
            data.append('zip', this.state.userUpdateZip);
            data.append('ifactive', this.state.userUpdateIfActive);
            data.append('password', this.state.userUpdatePassword);
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
                        address: json.address,
                        city: json.city,
                        state: json.state,
                        zip: json.zip,
                        ifactive: json.ifactive,
                        image: json.image ? json.image : 'user-avatar.jpg',
                        password: json.password
                    });
					this.setState({
                        userUpdateError: json.message,
                        userUpdateRole: '',
                        userUpdateName: '',
                        userUpdateEmail: '',
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
                                <input ref={(ref) => { this.state.uploadInput = ref; }} name="uploadInput" type="file" className="form-control-file btn btn-army"/>
                            </fieldset>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                                <fieldset className="form-group">
                                    <input value={this.state.fileName} onChange={this.onChange} name="fileName" type="text" className="form-element" placeholder="desired-name-of-file" />
                                </fieldset>
                                <div className="form-group">
                                    <select value={this.state.userUpdateRole} onChange={this.onChange} name="userUpdateRole" className="form-element custom">
                                        <option value="">Please select a value.</option>
                                        <option value="1">Customer</option>
                                        <option value="2">Employee</option>
                                        <option value="3">Administator</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <select value={this.state.userUpdateIfActive} onChange={this.onChange} name="userUpdateIfActive" className="form-element custom">
                                        <option value="">Please select a value.</option>
                                        <option value="0">Account Inactive</option>
                                        <option value="1">Account Active</option>
                                    </select>
                                </div>
                                <fieldset className="form-group">
                                    <input value={this.state.userUpdateName} onChange={this.onChange} name="userUpdateName" type="text" className="form-element" placeholder="Name"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input value={this.state.userUpdateEmail} onChange={this.onChange} name="userUpdateEmail" type="email" className="form-element" placeholder="Email"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input value={this.state.userUpdatePassword} onChange={this.onChange} name="userUpdatePassword" type="password" className="form-element" placeholder="Password"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input value={this.state.userUpdateAddress} onChange={this.onChange} name="userUpdateAddress" type="text" className="form-element" placeholder="Address"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input value={this.state.userUpdateCity} onChange={this.onChange} name="userUpdateCity" type="text" className="form-element" placeholder="City"/>
                                </fieldset>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-24">
                                <div className="form-group">
                                    <select value={this.state.userUpdateState} onChange={this.onChange} name="userUpdateState" className="form-element custom">
                                        {config.states.map(state => <option key={state.abrev} value={state.abrev}>{state.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-24">
                                <fieldset className="form-group">
                                    <input value={this.state.userUpdateZip} onChange={this.onChange} name="userUpdateZip" type="text" className="form-element" placeholder="Zip"/>
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