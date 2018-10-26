import React from 'react';

export default function OrderList(props) {
    if(props.orders == []) {
        return <ul className="ul-styles">
            {
                props.orders.map(order => 
                    <li key={order.id}> 
                        {order.date} {order.name} <a href="#" data-orderid={order.id} onClick={props.onView}>View</a> 
                    </li>
                )
            }
        </ul>
    } else {
        return <div><h3>No orders yet.</h3></div>
    }
}