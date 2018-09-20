import React from 'react';
import { connect } from 'react-redux';
import ProductItem from '../../product-components/product-item';

class EditItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            product = {},
        }
    }

    componentWillReceiveProps() {
        if(this.props.product[0].id != undefined) {
            this.setState({
                product: this.props.product 
            });
        }
        console.log(this.state);
    }

    render() {
        return (
            <div className="row space-top-20px space-bottom-50px">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                    <div className="product-listing" style={style}>
                        <ProductItem key={this.product.id}
                            product={this.product}
                            addToCart={props.addToCart}
                            removeFromCart={props.removeFromCart}
                            cartItem={props.cart.filter(cartItem => cartItem.id === product.id)[0]}
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