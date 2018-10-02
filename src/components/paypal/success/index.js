import React from 'react';
import { connect } from 'react-redux';
import Navigation from '../../navigation';
import Footer from '../../footer';
import config from '../../../config/config';

function sort(items) {
    return items.sort((a, b) => a.id < b.id);
}

class Success extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paypalSuccessError: '',
            paypalSuccessResults: ''
        }
    }

    componentDidMount() {
		fetch(config.site_url + '/api/paypal/success', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                payerId: this.props.location.search.split("?")[1].split("&")[2].split("=")[1],
                paymentId: this.props.location.search.split("?")[1].split("&")[0].split("=")[1]
			})
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    this.setState({
                        paypalSuccessError: json.message,
                        paypalSuccessResults: json.name
                    });
				} else {
                    this.setState({
						paypalSuccessError: json.message
					});
                }
			});
    }

    render() {
        //console.log(this.props.location.search.split("?")[1].split("&")[2].split("=")[1]);
        return (
            <div>
                <Navigation path="/success" authenticated={this.props.authentication[0].authenticated}/>
                <div className="container">
                    <div className="row space-top-20px space-bottom-50px">
                        <div className="col-lg-8 col-md-8 col-sm-12 col xs-24">
                            <h3>Thank you {this.state.paypalSuccessResults} for shopping with us.</h3>
                            <p>Please allow up to 6 weeks for shipping.</p>
                            {
                                (this.state.paypalSuccessError) ? (
                                    <label>{this.state.paypalSuccessError}</label>
                                ) : (null)
                            }
                            {
                                sort(this.props.cart).map( item =>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24 margin-bottom-20px" key={item.id}>
                                        <div className="col-lg-4 col-md-4 col-sm-12 col-xs-24">
                                            <img src={ `/img/products/${item.image}` } alt={item.name} className="img-responsive margin-center" />
                                        </div>
                                        <div className="col-lg-8 col-md-8 col-sm-12 col-xs-24 padding-top-20px text-center">
                                            <h2 className="zero-space-bottom">{item.name}</h2>
                                            <p className="zero-space-top">{item.description}</p>
                                            <h2 className="zero-space-bottom"></h2>
                                            <h2 className="zero-space-bottom">{item.quantity} @ ${ item.price * item.quantity }</h2>
                                        </div>
                                    </div>
                                )
                            }
                            
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-12 col xs-24">
                            <h4>Please come back and<br />shop with us again.</h4>
                            <p>There is a 100% money back garuntee if for any reason you are not satisfied with your products. Just return the item in the condition you recieved it to<br /><br />Returns<br />13066 Paddy Creek Ln<br />Lodi, CA 95240.</p>
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
        cart: state.cart,
        authentication: state.authentication
    }
}

export default connect(mapStateToProps)(Success)