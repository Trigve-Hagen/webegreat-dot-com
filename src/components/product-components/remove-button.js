import React from 'react';

export default function RemoveButton(props) {
    return <button className="btn btn-army margin-left-5px" onClick={() => props.removeFromCart(props.cartItem)}>-</button>
}