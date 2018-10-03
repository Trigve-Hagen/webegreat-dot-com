import React from 'react';
import { connect } from 'react-redux';
import Pagination from '../../product-components/pagination';
import config from '../../../config/config';

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
		fetch(config.site_url + '/api/product/front', {
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

    getProductObject(productId) {
        let obj={};
        this.state.products.map(product => {
            if(product.id == productId) {
                obj.id = product.id;
                obj.image = product.image;
                obj.name = product.name;
                obj.price = product.price;
                obj.description = product.description;
            }
        });
        return obj;
    }

    onView(productId) {
        this.props.updateProduct(this.getProductObject(productId));
    }

    onDelete(productId) {
        console.log(productId);
        let productObject = this.getProductObject(productId);
        if (confirm(`Are you sure you want to delete ${productObject.name}?`)) {
            fetch(config.site_url + '/api/product/delete-product', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
                id: productId,
                token: this.props.authentication[0].token
			})
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    let arrayArgs = [];
                    this.state.products.map(product => {
                        if(productId != product.id) {
                            arrayArgs.push({
                                id: product.id,
                                image: product.image,
                                name: product.name,
                                price: product.price,
                                description: product.description
                            });
                        }
                    });
                    this.setState({
                        loadProductError: json.message,
                        products: arrayArgs
                    });
                    this.props.updateProduct({
                        id: arrayArgs[0].id,
                        image: arrayArgs[0].image,
                        name: arrayArgs[0].name,
                        price: arrayArgs[0].price,
                        description: arrayArgs[0].description
                    });
                    //location.reload();
				} else {
                    this.setState({
						loadProductError: json.message
					});
                }
			});
        }
    }

    render() {
        //this.props.resetProduct();
        
        //const { products } = this.state;
        //console.log(products);
        return (
            <div>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        {
                            (this.state.loadProductError) ? (
                                <label>{this.state.loadProductError}</label>
                            ) : (null)
                        }
                        <Pagination />
                        <ul className="ul-styles">
                            {
                                this.state.products.map(product => 
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
        pagination: state.pagination,
        authentication: state.authentication
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