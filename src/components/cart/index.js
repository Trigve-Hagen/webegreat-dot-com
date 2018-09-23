import React from 'react';
import { connect } from 'react-redux';
import Navigation from '../navigation';
import Footer from '../footer';

const descriptionStyle = {
    marginTop: '0',
    paddingTop: '0',
    fontSize: '18px'
}

const paddingTop = {
    paddingTop: '20px'
}

const zeroBottomSpacingStyle = {
    marginBottom: '0',
    paddingBottom: '0'
}

const imageStyle = {
    margin: '0 auto'
}

const totalCheckout = {
    marginTop: '0px',
    marginBottom: '0px'
}

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
            cartTotal: 0
        }
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
                                        <img src={ `/img/products/${ item.image }` } alt={item.name} className="img-responsive" style={imageStyle} />
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-12 col-xs-24 text-center" style={paddingTop}>
                                        <h1 style={zeroBottomSpacingStyle}>{item.name}</h1>
                                        <p style={descriptionStyle}>{item.description}</p>
                                    </div>
                                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-24 text-center" style={paddingTop}>
                                        <h2 style={zeroBottomSpacingStyle}>{ item.quantity }</h2>
                                        <button onClick={() => this.props.addToCart(item)} className="btn btn-army">+</button>
                                        <button onClick={() => this.props.removeFromCart(item)} className="btn btn-army margin-left-5px">-</button>
                                    </div>
                                    <div className="col-lg-3 col-md-3 col-sm-6 col-xs-24 text-center">
                                        <h2 style={zeroBottomSpacingStyle}>${ item.price * item.quantity }</h2>
                                        <p>Grand Total: ${ (total += item.price * item.quantity).toFixed(2) }<br/>Tax included</p>
                                        <button onClick={() => this.props.removeAllFromCart(item)} className="btn btn-army vcenter">Remove All</button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <div className="row space-bottom-50px">
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-24">
                        <h1 style={checkoutCheckout}>Checkout</h1>
                            {
                                (this.state.cartError) ? (
                                    <label>{this.state.cartError}</label>
                                ) : (null)
                            }
                            <div className="form-group">
                                <input ref={(ref) => { this.state.cartName = ref; }} type="text" className="form-element" id="cartName" placeholder="Full Name" />
                            </div>
                            <div className="form-group">
                                <input ref={(ref) => { this.state.cartEmail = ref; }} type="text" className="form-element" id="cartEmail" placeholder="Email Address" />
                            </div>
                            <div className="form-group">
                                <input ref={(ref) => { this.state.cartAddress = ref; }} type="text" className="form-element" id="paypalPassword" placeholder="Address" />
                            </div>
                            <div className="form-group">
                                <input ref={(ref) => { this.state.cartCity = ref; }} type="text" className="form-element" id="paypalSignature" placeholder="City" />
                            </div>
                            <div className="form-group">
                                <input ref={(ref) => { this.state.cartState = ref; }} type="text" className="form-element" id="paypalAppId" placeholder="State" />
                            </div>
                            <div className="form-group">
                                <input ref={(ref) => { this.state.cartZip = ref; }} type="text" className="form-element" id="paypalAppId" placeholder="Zip" />
                            </div>
                            <input type="hidden" ref={(ref) => { this.state.cartTotal = ref; }} value={ total.toFixed(2) } />  
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-24">
                            <div className="row margin-bottom-20px">
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-24">
                                    <h1 style={totalCheckout}>Total: ${total.toFixed(2)}</h1>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-24 text-right">
                                    <button type="submit" onSubmit={this.onSubmit} className="btn btn-army">Checkout</button>
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