import React from 'react';

export default function AddButton(props) {
    return <button className="btn btn-army" onClick={() => props.addToCart(props.product)}>Add To Cart ({
        (props.cartItem && props.cartItem.quantity) || 0
    })</button>
}