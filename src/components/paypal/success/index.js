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
            paypalSuccessResults: '',
            windowHeight: 0,
            footerHeight: 0,
            menuHeight: 0
        }
    }

    componentDidMount() {
        let windowHeight = isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight;
        let footerHeight = document.getElementsByClassName('webegreat-footer')[0].clientHeight;
        let menuHeight = document.getElementsByClassName('webegreat-menu')[0].clientHeight;
        this.setState({
            windowHeight: windowHeight,
            footerHeight: footerHeight,
            menuHeight: menuHeight
        });
        
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
        let containerHeight = this.state.windowHeight - (this.state.menuHeight + this.state.footerHeight);
        return (
            <div>
                <Navigation path="/success" authenticated={this.props.authentication[0].authenticated}/>
                <div
                    className="container"
                    style={{
                        minHeight: containerHeight + 'px'
                    }}
                >
                    <div className="row">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            <div className="row margin-top-20px margin-bottom-20px">
                                <div className="col-lg-12 col-md-12 col-sm-12">
                                    <h4>Thank you {this.state.paypalSuccessResults} for shopping with us.</h4>
                                    <p>Please allow up to 6 weeks for shipping.</p>
                                    {
                                        (this.state.paypalSuccessError) ? (
                                            <label>{this.state.paypalSuccessError}</label>
                                        ) : (null)
                                    }
                                    {
                                        sort(this.props.cart).map( item =>
                                            <div className="row" key={item.id}>
                                                <div className="col-lg-12 col-md-12 col-sm-12">
                                                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4">
                                                        <img
                                                            src={ `/img/products/${item.image}` }
                                                            alt={item.name}
                                                            className="img-fluid"
                                                        />
                                                    </div>
                                                    <div className="col-xl-8 col-lg-8 col-md-8 col-sm-8">
                                                        <h3 className="zero-space-bottom">{item.name}</h3>
                                                        <p className="zero-space-bottom">{item.description}</p>
                                                        <h4>{item.quantity} @ ${ item.price * item.quantity }</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="row margin-bottom-50px">
                                <div className="col-lg-12 col-md-12 col-sm-12">
                                    <h4>Please come back and<br />shop with us again.</h4>
                                    <p>There is a 100% money back garuntee if for any reason you are not satisfied with your products. Just return the item in the condition you recieved it to<br /><br />Returns<br />Webegreat<br />13066 Paddy Creek Ln<br />Lodi, CA 95240.</p>
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
        cart: state.cart,
        authentication: state.authentication
    }
}

export default connect(mapStateToProps)(Success)