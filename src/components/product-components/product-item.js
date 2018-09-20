import React from 'react';
import AddButton from './add-button';
import RemoveButton from './remove-button';

const style = {
    marginTop: '20px'
}

export default function ProductItem(props) {
    return <div className="row" style={style}>
        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-24 text-center">
            <img
                alt={ props.product.name }
                src={ `/img/products/${ props.product.image }` }
                className="img-responsive"
            />
        </div>
        <div className="col-lg-9 col-md-9 col-sm-12 col-xs-24">
            <h3>{ props.product.name }</h3>
            <p>{ props.product.description }</p>
            <div className="product-price">
                <p>$ { props.product.price }</p>
            </div>
            <div className="product-button">
                <AddButton 
                    cartItem={props.cartItem}
                    product={props.product}
                    addToCart={props.addToCart}
                />
                {
                    props.cartItem
                        ? <RemoveButton 
                            cartItem={props.cartItem}
                            product={props.product}
                            removeFromCart={props.removeFromCart}
                        /> : null
                }
            </div>
        </div>
    </div>
}