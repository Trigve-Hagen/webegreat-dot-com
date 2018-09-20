import React from 'react';
import ProductItem from '../product-components/product-item';
import { connect } from 'react-redux';

const style = {
    marginTop: '20px'
}

function ProductListing(props) {
    return <div className="row space-top-20px space-bottom-50px">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                    <h1>Army Shop</h1>
                    <div className="product-listing" style={style}>
                        {
                            props.products.map( product =>
                                <ProductItem key={product.id}
                                    product={product}
                                    addToCart={props.addToCart}
                                    removeFromCart={props.removeFromCart}
                                    cartItem={props.cart.filter(cartItem => cartItem.id === product.id)[0]}
                                />
                            )
                        }
                    </div>
                </div>
            </div>
}

function mapStateToProps(state) {
    return {
        cart: state.cart
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addToCart: (item) => {
            dispatch({ type: 'ADD', payload: item })
        },
        removeFromCart: (item) => {
            dispatch({ type: 'REMOVE', payload: item })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductListing)