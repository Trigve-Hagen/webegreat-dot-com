import React from 'react';
import { connect } from 'react-redux';
import Navigation from '../navigation';
import Footer from '../footer';
import config from '../../config/config';

const checkoutCheckout = {
    marginTop: '0px',
    marginBottom: '25px'
}

function sort(items) {
    return items.sort((a, b) => a.id < b.id);
}

class Cart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cartError: '',
            cartName: '',
            cartEmail: '',
            cartAddress: '',
            cartCity: '',
            cartState: '',
            cartZip: '',
            cartProducts: []
        }
        this.onSubmit = this.onSubmit.bind(this);
    }

	onSubmit(e) {
        e.preventDefault();

        let items = ''; let cartTotal = 0; let count = 0;
        sort(this.props.cart).map(product => {
            if(count == this.props.cart.length - 1) items += product.id.toString() + "_" + product.quantity.toString();
            else items += product.id.toString() + "_" + product.quantity.toString() + "&";
            cartTotal += product.price * product.quantity;
            count++;
        });

        console.log(items);

        const data = new FormData();
            data.append('name', this.state.cartName.value);
            data.append('email', this.state.cartEmail.value);
            data.append('address', this.state.cartAddress.value);
            data.append('city', this.state.cartCity.value);
            data.append('state', this.state.cartState.value);
            data.append('zip', this.state.cartZip.value);
            data.append('items', items);
            data.append('total', cartTotal.toFixed(2));

		fetch(config.site_url + '/api/cart/call-paypal', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    console.log("Call paypal successfull.");
					this.setState({
                        cartError: json.message
                    });
				} else {
                    this.setState({
						cartError: json.message
					});
                }
			});
    }

    render() {
        let total = 0;
        return (
            <div>
                <Navigation path="/cart" authenticated={this.props.authentication[0].authenticated}/>
                <div className="container">
                    <div className="row space-top-50px">
                        {
                            sort(this.props.cart).map( item =>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24 margin-bottom-20px" key={item.id}>
                                    <div className="col-lg-2 col-md-2 col-sm-12 col-xs-24">
                                        <img src={ `/img/products/${item.image}` } alt={item.name} className="img-responsive margin-center" />
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-24 padding-top-20px text-center">
                                        <h2 className="zero-space-bottom">{item.name}</h2>
                                        <p className="zero-space-top">{item.description}</p>
                                    </div>
                                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-24 padding-top-20px text-center">
                                        <h2 className="zero-space-bottom">{item.quantity}</h2>
                                        <button onClick={() => this.props.addToCart(item)} className="btn btn-army">+</button>
                                        <button onClick={() => this.props.removeFromCart(item)} className="btn btn-army margin-left-5px">-</button>
                                    </div>
                                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-24 text-center">
                                        <h2 className="zero-space-bottom">${ item.price * item.quantity }</h2>
                                        <p>Grand Total: ${ (total += item.price * item.quantity).toFixed(2) }<br/>Tax included</p>
                                        <button onClick={() => this.props.removeAllFromCart(item)} className="btn btn-army vcenter">Remove All</button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <div className="row space-bottom-50px">
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-24">
                        <h2 style={checkoutCheckout}>Checkout</h2>
                            {
                                (this.state.cartError) ? (
                                    <label>{ this.state.cartError }</label>
                                ) : (null)
                            }
                        <form name="cartForm" onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <input ref={(ref) => { this.state.cartName = ref; }} type="text" className="form-element" id="cartName" placeholder="Full Name" />
                            </div>
                            <div className="form-group">
                                <input ref={(ref) => { this.state.cartEmail = ref; }} type="email" className="form-element" id="cartEmail" placeholder="Email Address" />
                            </div>
                            <div className="form-group">
                                <input ref={(ref) => { this.state.cartAddress = ref; }} type="text" className="form-element" id="cartAddress" placeholder="Address" />
                            </div>
                            <div className="form-group">
                                <input ref={(ref) => { this.state.cartCity = ref; }} type="text" className="form-element" id="cartCity" placeholder="City" />
                            </div>
                            <div className="form-group">
                                <input ref={(ref) => { this.state.cartState = ref; }} type="text" className="form-element" id="cartState" placeholder="State" />
                            </div>
                            <div className="form-group">
                                <input ref={(ref) => { this.state.cartZip = ref; }} type="number" className="form-element" id="cartZip" placeholder="Zip" />
                            </div>
                            <button type="submit" className="btn btn-army">Checkout</button>
                        </form>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-24">
                            <div className="row margin-bottom-20px">
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-24">
                                    <h2 className="margin-top-bottom-zero">Total: ${total.toFixed(2)}</h2>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-24 text-right">
                                    
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                                    <img src={ `/img/memorial-day.jpg` } className="img-responsive" alt="God bless our troops" />
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

function mapDispatchToProps(dispatch) {
    return {
        addToCart: (item) => {
            dispatch({ type: 'ADD', payload: item })
        },
        removeFromCart: (item) => {
            dispatch({ type: 'REMOVE', payload: item })
        },
        removeAllFromCart: (item) => {
            dispatch({ type: 'REMOVE_ALL', payload: item })
        },
        getTotal: (item) => {
            dispatch({ type: 'GET_TOTAL', payload: item })
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);