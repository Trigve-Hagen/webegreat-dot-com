import React from 'react';
import { connect } from 'react-redux';
import Navigation from '../navigation';
import Footer from '../footer';
import config from '../../config/config';
import states from '../../data/states';

const checkoutCheckout = {
    marginTop: '0px'
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
            paypaRedirect: '',
			windowHeight: 0,
            footerHeight: 0,
            menuHeight: 0
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
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
        if(this.props.authentication[0].authenticated == true) {
            fetch(config.site_url + '/api/account/get-account', {
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
                        this.setState({
                            cartError: json.message,
                            cartName: json.name,
                            cartEmail: json.email,
                            cartAddress: json.address,
                            cartCity: json.city,
                            cartState: json.state,
                            cartZip: json.zip
                        });
                    } else {
                        this.setState({
                            cartError: json.message
                        });
                    }
                });
        }
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
            data.append('name', this.state.cartName);
            data.append('email', this.state.cartEmail);
            data.append('address', this.state.cartAddress);
            data.append('city', this.state.cartCity);
            data.append('state', this.state.cartState);
            data.append('zip', this.state.cartZip);
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
        let containerHeight = this.state.windowHeight - (this.state.menuHeight + this.state.footerHeight);
        if(this.props.cart.length == 0) {
            return (
                <div>
                    <Navigation path="/cart" authenticated={this.props.authentication[0].authenticated}/>
                    <div
                        className="container"
                        style={{
                            minHeight: containerHeight + 'px'
                        }}
                    >
                        <div className="row">
                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 my-3">
                                <h3>The cart is empty.</h3>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            )
        } else {
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
                    <div
                        className="container"
                        style={{
                            minHeight: containerHeight + 'px'
                        }}
                    >
                        <div className="row">
                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                {
                                    sort(this.props.cart).map( item =>
                                        <div className="row mt-3" key={item.id}>
                                            <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12">
                                                <img src={ `/img/products/${item.image}` } alt={item.name} className="img-fluid margin-center" />
                                            </div>
                                            <div className="col-xl-10 col-lg-10 col-md-10 col-sm-12 pt-3 text-center">
                                                <div className="row mb-3">
                                                    <div className="col-xl-9 col-lg-9 col-md-9 col-sm-12 text-left">
                                                        <h4 className="mb-0">{item.name}</h4>
                                                        <p className="my-0">{item.description}</p>
                                                        <p className="my-0"><b>Sku:</b> {item.sku}</p>
                                                        <p className="mt-0"><b>In Stock:</b> {item.stock}</p>
                                                    </div>
                                                    <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                                                        <h4 className="mt-0">{item.quantity}</h4>
                                                        <button onClick={() => this.props.addToCart(item)} className="btn btn-army">+</button>
                                                        <button onClick={() => this.props.removeFromCart(item)} className="btn btn-army ml-1">-</button>
                                                        <button onClick={() => this.props.removeAllFromCart(item)} className="btn btn-army ml-1">X</button>
                                                        <h4 className="mb-0">${ (item.price * item.quantity).toFixed(2) }</h4>
                                                        <p>Tax included</p>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                <div className="row my-3">
                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                        <h2 style={checkoutCheckout}>Checkout</h2>
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                        <h2 className="margin-top-bottom-zero text-right">Total: ${total.toFixed(2)}</h2>
                                    </div>
                                </div>
                                <div className="row my-3">
                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                        {
                                            (this.state.cartError) ? (
                                                <label>{ this.state.cartError }</label>
                                            ) : (null)
                                        }
                                        <form name="cartForm" onSubmit={this.onSubmit}>
                                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                                <div className="form-group">
                                                    <input value={this.state.cartName} onChange={this.onChange} type="text" className="form-element" name="cartName" placeholder="Full Name" />
                                                </div>
                                                <div className="form-group">
                                                    <input value={this.state.cartEmail} onChange={this.onChange} type="email" className="form-element" name="cartEmail" placeholder="Email Address" />
                                                </div>
                                                <div className="form-group">
                                                    <input value={this.state.cartAddress} onChange={this.onChange} type="text" className="form-element" name="cartAddress" placeholder="Address" />
                                                </div>
                                                <div className="form-group">
                                                    <input value={this.state.cartCity} onChange={this.onChange} type="text" className="form-element" name="cartCity" placeholder="City" />
                                                </div>
                                            </div>
                                            <div className="row my-3">
                                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                                    <div className="form-group">
                                                        <select value={this.state.cartState} onChange={this.onChange} name="cartState" className="form-element custom">
                                                            {states.map(state => <option key={state.abrev} value={state.abrev}>{state.name}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                                    <div className="form-group">
                                                        <input value={this.state.cartZip} onChange={this.onChange} type="text" className="form-element" name="cartZip" placeholder="Zip" />
                                                    </div>
                                                </div>
                                            </div>  
                                            <button type="submit" className="btn btn-army mb-3">Checkout</button>
                                        </form>
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                        <div className="row">
                                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                                <img src={ `/img/memorial-day.jpg` } className="img-fluid" alt="God bless our troops" />
                                            </div>
                                        </div>
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