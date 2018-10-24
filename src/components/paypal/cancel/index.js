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
            paypalPaymentId: '',
            windowHeight: 0,
            footerHeight: 0,
            menuHeight: 0
        }
    }

    componentDidMount() {
		//console.log(window.innerHeight + ", " + window.clientHeight + ", " + window.height)
        let windowHeight = isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight;
        let footerHeight = document.getElementsByClassName('webegreat-footer')[0].clientHeight;
        let menuHeight = document.getElementsByClassName('webegreat-menu')[0].clientHeight;
        this.setState({
            windowHeight: windowHeight,
            footerHeight: footerHeight,
            menuHeight: menuHeight
		});
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
        let containerHeight = this.state.windowHeight - (this.state.menuHeight + this.state.footerHeight);
        return (
            <div>
                <Navigation path="/cancel" authenticated={this.props.authentication[0].authenticated}/>
                <div
                    className="container"
                    style={{
                        minHeight: containerHeight + 'px'
                    }}
                >
                    <div className="row margin-top-20px margin-bottom-50px">
                        <div className="col-lg-12 col-md-12 col-sm-12 col xs-24">
                            <h4>Please come back and shop with us again.</h4>
                            <p>There is a 100% money back guarantee if for any reason you are not satisfied with your products. Just return the item in the condition you received it to<br /><br /><h4>Returns</h4><br />13066 Paddy Creek Ln<br />Lodi, CA 95240.</p>
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