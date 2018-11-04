import React from 'react';
import AddButton from '../product-components/add-button';
import RemoveButton from '../product-components/remove-button';

export default function ProductItem(props) {
    return <div className="row mb-3">
                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                    <img
                        alt={ props.product.name }
                        src={ `/img/products/${ props.product.image }` }
                        className="img-fluid"
                    />
                </div>
                <div className="col-xl-9 col-lg-9 col-md-9 col-sm-12">
                    <h4 className="mb-1">{ props.product.name }</h4>
                    <p className="mb-1">{ props.product.description }</p>
                    <p className="mb-1">${ props.product.price }</p>
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