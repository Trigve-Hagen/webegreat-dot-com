import React from 'react';
import { connect } from 'react-redux';
import Navigation from '../navigation';
import Footer from '../footer';
import config from '../../config/config';

class Contact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contactError: '',
            contactName: '',
            contactEmail: '',
            contactMessage: '',
        }
        this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}

	onSubmit(e) {
		e.preventDefault();
		//console.log(this.state);
		const {
			contactName,
			contactEmail,
			contactMessage
		} = this.state;

		fetch(config.site_url + '/api/contact/request', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: contactName,
				email: contactEmail,
				message: contactMessage
			})
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
					console.log("Successfull Contact Request.");
					this.setState({
						contactError: json.message,
						contactName: '',
						contactEmail: '',
						contactMessage: ''
					});
					
				} else {
                    this.setState({
						contactError: json.message
					});
                }
			});
	}

    render() {
        return (
            <div>
                <Navigation path="/contact" />
                <div className="container">
                    <div className="row space-top-20px space-bottom-50px">
                        <div className="col-lg-12 col-md-12 col-sm-12 col xs-24">
                            <div className="row">
								<div className="col-lg-4 col-md-4 col-sm-12 col-xs-24 margin-top-20px">
                                <img src={ `/img/sniper.jpg` } alt="rifle range" className="img-responsive margin-center" />
								</div>
								<div className="col-lg-8 col-md-8 col-sm-12 col-xs-24 margin-top-20px">
									{
										(this.state.contactError) ? (
											<label>{this.state.contactError}</label>
										) : (null)
									}
									<form name="contact" onSubmit={this.onSubmit}>
										<fieldset className="form-group">
											<input value={this.state.contactName} onChange={this.onChange} type="text" name="contactName" className="form-element" id="contactName" placeholder="Full Name"/>
										</fieldset>
										<fieldset className="form-group">
											<input value={this.state.contactEmail} onChange={this.onChange} type="email" name="contactEmail" className="form-element" id="contactEmail" placeholder="someone@somewhere.com"/>
										</fieldset>
										<fieldset className="form-group">
                                            <textarea value={this.state.contactMessage} onChange={this.onChange} name="contactMessage" className="form-element" rows="3" placeholder="Message"/>
										</fieldset>
										<button type="submit" className="btn btn-army">Submit</button>
									</form>
								</div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        authentication: state.authentication
    }
}

export default connect(mapStateToProps)(Contact)