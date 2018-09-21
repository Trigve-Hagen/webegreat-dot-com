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
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
		this.setState({ [e.target.name]: e.target.value});
	}

	onSubmit(e) {
        e.preventDefault();
        const {
            paypalUsername,
            paypalPassword,
            paypalSignature,
            paypalAppId
		} = this.state;

		fetch('http://localhost:4000/api/account/upload-image', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
                username: paypalUsername,
                password: paypalPassword,
                signature: paypalSignature,
                appId: paypalAppId,
			})
		}).then(res => res.json())
			.then(json => {
				/*if(json.success) {
                    console.log("Successfull SignIn." + json.token);
					this.props.updateAuth({ authenticated: true, token: json.token });
					this.setState({
                        loginError: json.message,
                        loginRedirect: true
					});
                    
				} else {
                    this.setState({
						loginError: json.message
					});
                }*/
			});
    }

    render() {
        const { paypalUsername, paypalPassword, paypalSignature, paypalAppId, paypalError } = this.state;
        return (
            <div>
                <div className="row space-top-20px">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        <h3>Update Paypal Credentials</h3>
                        {
                            (paypalError) ? (
                                <label>{paypalError}</label>
                            ) : (null)
                        }
                        <form className="paypalCredentials" onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <input type="text" value={paypalUsername} onChange={this.onChange} className="form-element" id="paypalUsername" placeholder="Paypal Username" />
                            </div>
                            <div className="form-group">
                                <input type="text" value={paypalPassword} onChange={this.onChange} className="form-element" id="paypalPassword" placeholder="Paypal Password" />
                            </div>
                            <div className="form-group">
                                <input type="text" value={paypalSignature} onChange={this.onChange} className="form-element" id="paypalSignature" placeholder="Paypal Signature" />
                            </div>
                            <div className="form-group">
                                <input type="text" value={paypalAppId} onChange={this.onChange} className="form-element" id="paypalAppId" placeholder="Paypal Application Id" />
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