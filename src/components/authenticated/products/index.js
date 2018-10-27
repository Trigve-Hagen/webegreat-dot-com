import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Navigation from '../../navigation';
import Footer from '../../footer';
import UploadProducts from './upload-products';
import UpdateProducts from './update-products';
import ProductItem from './product-item';
import Pagination from '../../pagination';
import ProductList from './product-list';
import config from '../../../config/config';

class Products extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: config.per_page,
            loadProductError: '',
            currentPage: 1,
            products: [],
            product: [],
            pages: []
        }
        this.onView = this.onView.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onChangePagination = this.onChangePagination.bind(this);
    }

    fetchProducts() {
        fetch(config.site_url + '/api/product/front', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				currentPage: this.state.currentPage,
                perPage: this.state.perPage,
                searchString: "all"
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
                            menu: value['menu_location'],
                            name: value['name'],
                            price: value['price'],
                            stock: value['stock'],
                            ifmanaged: value['managed_stock'],
                            description: value['description']
                        });
                    }
					this.setState({
                        loadProductError: json.message,
                        products: arrayArgs,
                        product: arrayArgs[0]
					});
				} else {
                    this.setState({
						loadProductError: json.message
					});
                }
			});
    }

    fetchPages() {
        fetch(config.site_url + '/api/database/pagination', {
            method: 'POST',
            headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
                db: "products",
				perPage: this.state.perPage
			})
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    let range = [];
                    for(let i = 1; i <= json.pages; i++) range.push(i);
                    this.setState({
                        pages: range,
                        loadProductError: json.message
					});
				} else {
                    this.setState({
                        loadProductError: json.message
					});
                }
			});
    }

    componentDidMount() {
        this.fetchPages();
        this.fetchProducts();
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

    onChangePagination(e) {
        if(e.target.dataset.currentpage !== undefined) {
            this.setState({ currentPage: e.target.dataset.currentpage });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.currentPage !== this.state.currentPage) {
            this.setState({ currentPage: this.state.currentPage });
            this.fetchPages();
            this.fetchProducts();
        }
    }

    onView(e) {
        this.setState({ product: this.getProductObject(e.target.dataset.productid) });
    }

    onDelete(e) {
        let productId = e.target.dataset.productid;
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
    }

    render() {
        if(this.props.authentication[0].authenticated && this.props.authentication[0].role == 3) {
            return (
                <div>
                    <Navigation
                        path="/products"
                        authenticated={this.props.authentication[0].authenticated}
                        role={this.props.authentication[0].role}
                    />
                    <div className="container">
                        <div className="row margin-top-50px">
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
                            <h2>Create Product</h2>
                                <Pagination
                                    pages={this.state.pages}
                                    onChangePagination={this.onChangePagination}
                                    currentPage={this.state.currentPage}
                                    perPage={this.state.perPage}
                                />
                                    <ProductList
                                        products={this.state.products}
                                        onView={this.onView}
                                        onDelete={this.onDelete}
                                    />
                                <Pagination
                                    pages={this.state.pages}
                                    onChangePagination={this.onChangePagination}
                                    currentPage={this.state.currentPage}
                                    perPage={this.state.perPage}
                                />
                                {
                                    (this.state.loadProductError) ? (
                                        <label>{this.state.loadProductError}</label>
                                    ) : (null)
                                }
                                <UploadProducts />
                            </div>
                            <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12">
                                <ProductItem product={this.state.product}/>
                                <UpdateProducts product={this.state.product}/>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            )
        } else return <Redirect to='/' />;
    }
}

function mapStateToProps(state) {
    return {
        authentication: state.authentication
    }
}

export default connect(mapStateToProps)(Products)