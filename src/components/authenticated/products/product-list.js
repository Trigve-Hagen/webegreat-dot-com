import React from 'react';
import { connect } from 'react-redux';
import Pagination from '../../pagination';
import config from '../../../config/config';

class ProductList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        //this.props.resetProduct();
        return (
            <div>
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <Pagination
                        database="products"
                        perPage={config.per_page}
                        token={this.props.authentication[0].token}
                    />
                    <ul className="ul-styles">
                        {
                            this.props.products.map(product => 
                                <li key={product.id}> 
                                    {product.name} 
                                    <a href="#" data-productid={product.id} onClick={this.props.onView}> View</a>  
                                    <a href="#" data-productid={product.id} onClick={this.props.onDelete}> Delete</a> 
                                </li>
                            )
                        }
                    </ul>
                    <Pagination
                        database="products"
                        perPage={config.per_page}
                        token={this.props.authentication[0].token}
                    />
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        pagination: state.pagination,
        authentication: state.authentication
    }
}

export default connect(mapStateToProps)(ProductList);