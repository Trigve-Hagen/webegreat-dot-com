import React from 'react';
import { connect } from 'react-redux';

class ProductListing extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <ul className="pagination">
                    {
                        props.products.map(product => {
                            <li>
                                {product.name} 
                                <a onClick={props.onView(product.id)}>View</a> 
                                <a onClick={props.onDelete(product.id)}>Delete</a>
                            </li>
                        })
                    }
                </ul>
            </div>
        )
    }
}

export default ProductListing;