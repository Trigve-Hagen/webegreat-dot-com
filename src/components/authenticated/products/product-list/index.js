import React from 'react';
import { connect } from 'react-redux';
import Pagination from '../../../product-components/pagination';

class ProductList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 15,
            loadProductError: '',
            products: []
        }
        this.onView = this.onView.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    componentDidMount() {
		fetch('http://localhost:4000/api/product/front', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				currentPage: this.props.pagination[0].currentPage,
                perPage: this.state.perPage,
			})
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    let arrayArgs = [];
                    for (let value of Object.values(json.products)) {
                        arrayArgs.push({
                            id: value['productid'],
                            image: value['image'],
                            name: value['name'],
                            price: value['price'],
                            description: value['description']
                        });
                    }
                    //console.log(arrayArgs);
					this.setState({
                        loadProductError: json.message,
                        products: arrayArgs
					});
				} else {
                    this.setState({
						loadProductError: json.message
					});
                }
			});
    }

    onView(productId) {
        console.log(productId);
        this.state.products.map(product => {
            if(product.id == productId) {
                this.props.updateProduct({
                    id: product.id,
                    image: product.image,
                    name: product.name,
                    price: product.price,
                    description: product.description
                });
            }
        });
    }

    onDelete(productId) {
        console.log(productId);
    }

    render() {
        //this.props.resetProduct();
        
        const { products } = this.state;
        console.log(products);
        return (
            <div>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        <Pagination />
                        <ul className="ul-styles">
                            {
                                products.map(product => 
                                    <li key={product.id}> 
                                        {product.name} 
                                        <a href="#" onClick={() => this.onView(product.id)}> View</a>  
                                        <a href="#" onClick={() => this.onDelete(product.id)}> Delete</a> 
                                    </li>
                                )
                            }
                        </ul>
                        <Pagination />
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        pagination: state.pagination
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateProduct: (value) => {
            dispatch({ type: 'UPDATE_PRODUCT', payload: value})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);