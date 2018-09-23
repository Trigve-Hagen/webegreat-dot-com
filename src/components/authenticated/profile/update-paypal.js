import React from 'react';
import { connect } from 'react-redux';

class UpdatePaypal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paypalError: '',
            paypalUsername: '',
            paypalPassword: '',
            paypalSignature: '',
            paypalAppId: '',
        }
        this.onSubmit = this.onSubmit.bind(this);
    }

	onSubmit(e) {
		e.preventDefault();

        const data = new FormData();
            data.append('username', this.state.paypalUsername);
            data.append('password', this.state.paypalPassword);
            data.append('signature', this.state.paypalSignature);
            data.append('appid', this.state.paypalAppId);
            data.append('token', this.props.authentication[0].token);

		fetch('http://localhost:4000/api/profile/update-paypal', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
					console.log("Paypal update successfull.");
					this.setState({
                        paypalError: json.message,
                        paypalUsername: '',
                        paypalPassword: '',
                        paypalSignature: '',
                        paypalAppId: ''
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
                            <div className="form-group">
                                <input ref={(ref) => { this.state.paypalUsername = ref; }} type="text" className="form-element" id="paypalUsername" placeholder="Paypal Username" />
                            </div>
                            <div className="form-group">
                                <input ref={(ref) => { this.state.paypalPassword = ref; }} type="text" className="form-element" id="paypalPassword" placeholder="Paypal Password" />
                            </div>
                            <div className="form-group">
                                <input ref={(ref) => { this.state.paypalSignature = ref; }} type="text" className="form-element" id="paypalSignature" placeholder="Paypal Signature" />
                            </div>
                            <div className="form-group">
                                <input ref={(ref) => { this.state.paypalAppId = ref; }} type="text" className="form-element" id="paypalAppId" placeholder="Paypal Application Id" />
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