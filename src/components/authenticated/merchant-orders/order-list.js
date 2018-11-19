import React from 'react';

export default function OrderList(props) {
    if(props.orders) {
        return <ul className="ul-styles">
            {
                props.orders.map(order => 
                    <li key={order.id}> 
                        {order.date} {order.name} <a href="#" data-orderid={order.id} onClick={props.onView}>View</a> <a href="#" data-orderid={order.id} onClick={props.onDelete}>Delete</a> 
                    </li>
                )
            }
        </ul>
    } else {
        return <div><p>No orders yet.</p></div>
    }
}