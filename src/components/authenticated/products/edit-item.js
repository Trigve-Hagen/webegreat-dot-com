import React from 'react';
import { connect } from 'react-redux';
import ProductItem from '../../product-components/product-item';

class EditItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="row space-top-20px space-bottom-50px">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                    <div className="product-listing">
                        <ProductItem key={this.props.product[0].id}
                            product={this.props.product}
                            addToCart={this.props.addToCart}
                            removeFromCart={this.props.removeFromCart}
                            cartItem={this.props.cart.filter(cartItem => cartItem.id === this.props.product[0].id)[0]}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        cart: state.cart,
        product: state.product
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

export default connect(mapStateToProps, mapDispatchToProps)(EditItem)