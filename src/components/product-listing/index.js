import React from 'react';
import ProductItem from './product-item';
import { connect } from 'react-redux';

function ProductListing(props) {
    //console.log(props.products);
    if(props.products.length == 0) {
        return <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="row mb-3">
                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                <h3>There are no products yet.</h3>
                            </div>
                        </div>
                    </div>
                </div>
    } else {
        return <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
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
    }
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