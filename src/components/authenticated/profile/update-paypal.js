import React from 'react';
import { connect } from 'react-redux';
import config from '../../../config/config';

class UpdatePaypal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paypalError: '',
            paypalMode: '',
            paypalClient: '',
            paypalSecret: ''
        }
        this.onSubmit = this.onSubmit.bind(this);
    }

	onSubmit(e) {
		e.preventDefault();

        const data = new FormData();
            data.append('mode', this.state.paypalMode.value);
            data.append('client', this.state.paypalClient.value);
            data.append('secret', this.state.paypalSecret.value);
            data.append('token', this.props.authentication[0].token);

		fetch(config.site_url + '/api/profile/update-paypal', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
					console.log("Paypal update successfull.");
					this.setState({
                        paypalError: json.message,
                        paypalClient: '',
                        paypalSecret: ''
                    });
				} else {
                    this.setState({
						paypalError: json.message
					});
                }
			});
    }

    render() {
        return (
            <div>
                <div className="row space-top-20px">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        <h3>Update Paypal Credentials</h3>
                        {
                            (this.state.paypalError) ? (
                                <label>{this.state.paypalError}</label>
                            ) : (null)
                        }
                        <form className="paypalCredentials" onSubmit={this.onSubmit}>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                                <div className="form-group">
                                    <select ref={ (ref) => { this.state.paypalMode = ref; }} className="form-element custom">
                                        <option value="sandbox">Sandbox</option>
                                        <option value="live">Live</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <input ref={(ref) => { this.state.paypalClient = ref; }} type="text" className="form-element" id="paypalClient" placeholder="Paypal Client Id" />
                                </div>
                                <div className="form-group">
                                    <input ref={(ref) => { this.state.paypalSecret = ref; }} type="text" className="form-element" id="paypalClient" placeholder="Paypal Secret" />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-army">Update Paypal Credentials</button>
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

export default connect(mapStateToProps)(UpdatePaypal)