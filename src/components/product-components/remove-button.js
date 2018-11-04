import React from 'react';

export default function RemoveButton(props) {
    return <button className="btn btn-army ml-1" onClick={() => props.removeFromCart(props.cartItem)}>-</button>
}