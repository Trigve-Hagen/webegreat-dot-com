import React from 'react';

export default function AddButton(props) {
    return <button className="btn btn-army" onClick={() => props.addToCart(props.product)}>+ ({
        (props.cartItem && props.cartItem.quantity) || 0
    })</button>
}