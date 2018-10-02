import React from 'react';
import { connect } from 'react-redux';
import Navigation from '../../navigation';
import Footer from '../../footer';
import config from '../../../config/config';

class Cancel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paypalCancelError: '',
            paypalPaymentId: ''
        }
    }

    componentDidMount() {
		fetch(config.site_url + '/api/paypal/cancel', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                paymentId: this.state.paypalPaymentId
			})
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    this.setState({
                        paypalCancelError: json.message
                    });
				} else {
                    this.setState({
						paypalCancelError: json.message
					});
                }
			});
    }

    render() {
        return (
            <div>
                <Navigation path="/cancel" authenticated={this.props.authentication[0].authenticated}/>
                <div className="container">
                    <div className="row space-top-20px space-bottom-50px">
                        <div className="col-lg-12 col-md-12 col-sm-12 col xs-24">
                            <h4>Please come back and shop with us again.</h4>
                            <p>There is a 100% money back garuntee if for any reason you are not satisfied with your products. Just return the item in the condition you recieved it to<br /><br />Returns<br />13066 Paddy Creek Ln<br />Lodi, CA 95240.</p>
                            {
                                (this.state.paypalCancelError) ? (
                                    <label>{this.state.paypalCancelError}</label>
                                ) : (null)
                            }
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

export default connect(mapStateToProps)(Cancel)