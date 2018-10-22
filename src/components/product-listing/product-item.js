import React from 'react';
import AddButton from '../product-components/add-button';
import RemoveButton from '../product-components/remove-button';

export default function ProductItem(props) {
    return <div className="menu-background margin-bottom-20px">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className="col-lg-3 col-md-3 col-sm-9 margin-bottom-5px">
                            <img
                                alt={ props.product.name }
                                src={ `/img/products/${ props.product.image }` }
                                className="img-fluid"
                            />
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-9">
                            <h3 className="margin-bottom-5px">{ props.product.name }</h3>
                            <p className="margin-bottom-5px">{ props.product.description }</p>
                            <p className="margin-bottom-5px">${ props.product.price }</p>
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
                </div>
            </div>
}