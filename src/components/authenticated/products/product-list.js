import React from 'react';
import { connect } from 'react-redux';
import Pagination from '../../product-components/pagination';
import config from '../../../config/config';

class ProductList extends React.Component {
    constructor(props) {
        super(props);
        /*this.state = {
            perPage: 15,
            loadProductError: '',
            products: []
        }
        this.onView = this.onView.bind(this);
        this.onDelete = this.onDelete.bind(this);*/
    }

    /*componentDidMount() {
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
                            sku: value['sku'],
                            menu: value['menu'],
                            name: value['name'],
                            price: value['price'],
                            stock: value['stock'],
                            ifmanaged: value['ifmanaged'],
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
                obj.menu = product.menu;
                obj.image = product.image;
                obj.sku = product.sku;
                obj.name = product.name;
                obj.stock = product.stock;
                obj.ifmanaged = product.ifmanaged;
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
                                menu: product.menu,
                                sku: product.sku,
                                image: product.image,
                                name: product.name,
                                stock: product.stock,
                                price: product.price,
                                ifmanaged: product.ifmanaged,
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
                        menu: arrayArgs[0].menu,
                        sku: arrayArgs[0].sku,
                        image: arrayArgs[0].image,
                        name: arrayArgs[0].name,
                        stock: arrayArgs[0].stock,
                        price: arrayArgs[0].price,
                        ifmanaged: arrayArgs[0].ifmanaged,
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
    }*/

    render() {
        //this.props.resetProduct();
        
        //const { products } = this.state;
        //console.log(products);
        return (
            <div>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        <Pagination />
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