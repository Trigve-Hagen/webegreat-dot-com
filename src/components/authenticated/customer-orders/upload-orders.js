import React from 'react';
import { connect } from 'react-redux';
import config from '../../../config/config';

class UploadOrders extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
            cordersUploadError: '',
            cordersUploadName: '',
            cordersUploadEmail: '',
            cordersUploadAddress: '',
            cordersUploadCity: '',
            cordersUploadState: '',
            cordersUploadZip: '',
            cordersUploadItems: '',
            cordersUploadNumofs: '',
            cordersUploadPrices: ''
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
            data.append('name', this.state.userUploadName);
            data.append('email', this.state.cordersUploadName);
            data.append('address', this.state.cordersUploadAddress);
			data.append('city', this.state.cordersUploadCity);
            data.append('state', this.state.cordersUploadState);
            data.append('zip', this.state.cordersUploadZip);
            data.append('items', this.state.cordersUploadItems);
            data.append('numofs', this.state.cordersUploadNumofs);
            data.append('prices', this.state.cordersUploadPrices);
            data.append('token', this.props.authentication[0].token);

		fetch(config.site_url + '/api/roles/upload', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
					console.log("User upload successfull.");
					this.props.updateCOrders({
                        id: json.id,
                        name: json.name,
                        email: json.email,
                        address: json.address,
                        city: json.city,
                        state: json.state,
                        zip: json.zip,
                        items: json.items,
                        numofs: json.numofs,
                        prices: json.prices
                    });
					this.setState({
                        cordersUploadError: json.message,
                        cordersUploadName: '',
                        cordersUploadEmail: '',
                        cordersUploadAddress: '',
                        cordersUploadCity: '',
                        cordersUploadState: '',
                        cordersUploadZip: '',
                        cordersUploadItems: '',
                        cordersUploadNumofs: '',
                        cordersUploadPrices: ''
                    });
				} else {
                    this.setState({
						cordersUploadError: json.message
					});
                }
			});
	}

    render() {
        //this.props.resetRole();
        return (
			<div>
                <h3>Customer Orders Upload</h3>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        {
                            (this.state.cordersUploadError) ? (
                                <label>{this.state.cordersUploadError}</label>
                            ) : (null)
                        }
                        <form name="userUpload" onSubmit={this.onSubmit}>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                                <fieldset className="form-group">
                                    <input value={this.state.cordersUploadName} onChange={this.onChange} name="cordersUploadName" type="text" className="form-element" placeholder="Name"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input value={this.state.cordersUploadEmail} onChange={this.onChange} name="cordersUploadEmail" type="email" className="form-element" placeholder="Email"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input value={this.state.cordersUploadAddress} onChange={this.onChange} name="cordersUploadAddress" type="text" className="form-element" placeholder="Address"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input value={this.state.cordersUploadCity} onChange={this.onChange} name="cordersUploadCity" type="text" className="form-element" placeholder="City"/>
                                </fieldset>
                                    <div className="form-group">
                                        <select value={this.state.cordersUploadState} onChange={this.onChange} name="cordersUploadState" className="form-element custom">
                                            {config.states.map(state => <option key={state.abrev} value={state.abrev}>{state.name}</option>)}
                                        </select>
                                    </div>
                                <fieldset className="form-group">
                                    <input value={this.state.cordersUploadZip} onChange={this.onChange} name="cordersUploadZip" type="text" className="form-element" placeholder="Zip"/>
                                </fieldset>
                            </div>
                            <button type="submit" className="btn btn-army">Customer Orders Upload</button>
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
        corders: state.corders,
        authentication: state.authentication
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateCOrders: (value) => {
            dispatch({ type: 'UPDATE_CORDER', payload: value})
        },
        resetCOrders: (value) => {
            dispatch({ type: 'RESET_CORDER', payload: value})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadOrders);