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
            cartProducts: [],
            cartRedirect: false,
            paypaRedirect: ''
        }
        this.onSubmit = this.onSubmit.bind(this);
    }

	onSubmit(e) {
        e.preventDefault();

        let items = ''; let proids = ''; let numofs = ''; let prices = ''; let cartTotal = 0; let count = 0;
        sort(this.props.cart).map(product => {
            if(count == this.props.cart.length - 1) {
                items += product.id.toString() + "_" + product.quantity.toString();
                proids += product.id.toString();
                numofs += product.quantity.toString();
                prices += product.price.toString();
            } else {
                items += product.id.toString() + "_" + product.quantity.toString() + "&";
                proids += product.id.toString() + "_";
                numofs += product.quantity.toString() + "_";
                prices += product.price.toString() + "_";
            }
            cartTotal += product.price * product.quantity;
            count++;
        });

        //console.log(items);

        const data = new FormData();
            data.append('name', this.state.cartName.value);
            data.append('email', this.state.cartEmail.value);
            data.append('address', this.state.cartAddress.value);
            data.append('city', this.state.cartCity.value);
            data.append('state', this.state.cartState.value);
            data.append('zip', this.state.cartZip.value);
            data.append('items', items);
            data.append('proids', proids);
            data.append('numofs', numofs);
            data.append('prices', prices);
            data.append('total', cartTotal.toFixed(2));

		fetch(config.site_url + '/api/cart/call-paypal', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    console.log("Call paypal successfull.");
					this.setState({
                        cartError: "Redirecting to Paypal...",
                        cartRedirect: true,
                        paypaRedirect: json.url
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
        if(this.state.cartRedirect) window.location.href = this.state.paypaRedirect;
        if(this.props.cart.length == 0) {
            return (
                <div>
                    <Navigation path="/cart" authenticated={this.props.authentication[0].authenticated}/>
                    <div className="container">
                        <div className="row margin-top-50px margin-bottom-50px">
                            <h3>The cart is empty.</h3>
                        </div>
                    </div>
                    <Footer />
                </div>
            )
        } else {
            let total = 0;
            sort(this.props.cart).map( item => {
                total += parseFloat(item.price) * parseInt(item.quantity);
            });
            return (
                <div>
                    <Navigation
                        path="/cart"
                        authenticated={this.props.authentication[0].authenticated}
                        role={this.props.authentication[0].role}
                    />
                    <div className="container">
                        {
                            sort(this.props.cart).map( item =>
                                <div className="row margin-top-20px" key={item.id}>
                                    <div className="col-lg-3 col-md-3 col-sm-3">
                                        <img src={ `/img/products/${item.image}` } alt={item.name} className="img-fluid margin-center" />
                                    </div>
                                    <div className="col-lg-9 col-md-9 col-sm-9 padding-top-20px text-center">
                                        <h3 className="zero-space-bottom">{item.name}</h3>
                                        <p className="zero-space-top">{item.description}</p>
                                        <div className="row margin-bottom-20px">
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <h2 className="zero-space-bottom">{item.quantity}</h2>
                                                <button onClick={() => this.props.addToCart(item)} className="btn btn-army">+</button>
                                                <button onClick={() => this.props.removeFromCart(item)} className="btn btn-army margin-left-5px">-</button>
                                                <button onClick={() => this.props.removeAllFromCart(item)} className="btn btn-army margin-left-5px">X</button>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <h2 className="zero-space-bottom">${ (item.price * item.quantity).toFixed(2) }</h2>
                                                <p>Tax included</p>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        <div className="row margin-top-20px margin-bottom-20px">
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <h2 style={checkoutCheckout}>Checkout</h2>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <h2 className="margin-top-bottom-zero text-right">Total: ${total.toFixed(2)}</h2>
                            </div>
                        </div>
                        <div className="row margin-top-50px margin-bottom-50px">
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                {
                                    (this.state.cartError) ? (
                                        <label>{ this.state.cartError }</label>
                                    ) : (null)
                                }
                                <form name="cartForm" onSubmit={this.onSubmit}>
                                    <div className="col-lg-12 col-md-12 col-sm-12">
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
                                    </div>
                                    <div className="row margin-top-20px margin-bottom-20px">
                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                            <div className="form-group">
                                                <select ref={ (ref) => { this.state.cartState = ref; }} className="form-element custom">
                                                    {config.states.map(state => <option key={state.abrev} value={state.abrev}>{state.name}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                            <div className="form-group">
                                                <input ref={(ref) => { this.state.cartZip = ref; }} type="text" className="form-element" id="cartZip" placeholder="Zip" />
                                            </div>
                                        </div>
                                    </div>  
                                    <button type="submit" className="btn btn-army margin-bottom-20px">Checkout</button>
                                </form>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12">
                                <div className="row">
                                    <div className="col-lg-12 col-md-12 col-sm-12">
                                        <img src={ `/img/memorial-day.jpg` } className="img-fluid" alt="God bless our troops" />
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