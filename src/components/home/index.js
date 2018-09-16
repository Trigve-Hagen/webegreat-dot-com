import React from 'react';
import ProductListing from '../product-listing';
import products from '../../data/products';

export default function home(props) {
    return <div>
            <div className="container">
                <ProductListing products={products}/>
            </div>
        </div>
}