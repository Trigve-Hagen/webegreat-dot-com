import React from 'react';

export default function ProductList(props) {
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