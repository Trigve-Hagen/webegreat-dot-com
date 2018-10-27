import React from 'react';

export default function ProductList(props) {
    if(props.products == []) {
        return <div><h3>There are no products yet.</h3></div>
    } else {
        return <ul className="ul-styles">
            {
                props.products.map(product => 
                    <li key={product.id}> 
                        {product.name} 
                        <a href="#" data-productid={product.id} onClick={props.onView}> View</a>  
                        <a href="#" data-productid={product.id} onClick={props.onDelete}> Delete</a> 
                    </li>
                )
            }
        </ul>
    }
}