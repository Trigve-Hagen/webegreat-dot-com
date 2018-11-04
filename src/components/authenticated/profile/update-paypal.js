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
            paypalSecret: '',
            paypalClientInputType: 'password',
            paypalSecretInputType: 'password'
        }
        this.onClickView = this.onClickView.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onClickView(e) {
        console.log(e.target.name);
        if(e.target.name == 'client') {
            this.setState({ paypalClientInputType: this.state.paypalClientInputType === 'password' ? 'text' : 'password' })
        }
        if(e.target.name == 'secret') {
            this.setState({ paypalSecretInputType: this.state.paypalSecretInputType === 'password' ? 'text' : 'password' })
        }
    }

    onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
    }

    componentDidMount() {
        fetch(config.site_url + '/api/account/get-paypal', {
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
                    //console.log(json.mode);
					this.setState({
                        paypalError: json.message,
                        paypalMode: json.mode,
                        paypalClient: json.client,
                        paypalSecret: json.secret
					});
				} else {
                    this.setState({
						paypalError: json.message
					});
                }
			});
    }

	onSubmit(e) {
        //console.log(this.state.paypalMode);
		e.preventDefault();

        const data = new FormData();
            data.append('mode', this.state.paypalMode);
            data.append('client', this.state.paypalClient);
            data.append('secret', this.state.paypalSecret);
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
                        paypalMode: json.mode,
                        paypalClient: json.client,
                        paypalSecret: json.secret
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
                <div className="row mt-3">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <h3>Update Paypal Credentials</h3>
                        {
                            (this.state.paypalError) ? (
                                <label>{this.state.paypalError}</label>
                            ) : (null)
                        }
                        <form className="paypalCredentials" onSubmit={this.onSubmit}>
                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                <div className="form-group">
                                    <select value={this.state.paypalMode} onChange={this.onChange} name="paypalMode" className="form-element custom">
                                        <option value="">Please select a value..</option>
                                        <option value="sandbox">Sandbox</option>
                                        <option value="live">Live</option>
                                    </select>
                                </div>
                                <div className="input-group mt-3">
                                    <input
                                        value={this.state.paypalClient}
                                        onChange={this.onChange}
                                        type={this.state.paypalClientInputType}
                                        className="form-element"
                                        name="paypalClient"
                                        placeholder="Paypal Client Id"
                                    />
                                    <button
                                        className="btn btn-army mt-2"
                                        type="button"
                                        name="client"
                                        onClick={this.onClickView}
                                    >View</button>
                                </div>
                                <div className="input-group mt-3">
                                    <input
                                        value={this.state.paypalSecret}
                                        onChange={this.onChange}
                                        type={this.state.paypalSecretInputType}
                                        className="form-element"
                                        name="paypalSecret"
                                        placeholder="Paypal Secret"
                                    />
                                    <button 
                                        className="btn btn-army mt-2"
                                        type="button"
                                        name="secret"
                                        onClick={this.onClickView}
                                    >View</button>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-army mt-3">Update Paypal Credentials</button>
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