import React from 'react';
import { connect } from 'react-redux';
import ProductListing from '../product-listing';
//import products from '../../data/products';
import Navigation from '../navigation';
import Footer from '../footer';
import config from '../../config/config';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 15,
            currentPage: 1,
            loadProductError: '',
            products: []
        }
    }

    componentDidMount() {
		fetch(config.site_url + '/api/product/front', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				currentPage: this.state.currentPage,
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
                    console.log(arrayArgs);
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

    render() {
        //this.props.resetProduct();
        //console.log(this.state.products);
        return (
            <div>
                <Navigation path="/" authenticated={this.props.authentication[0].authenticated}/>
                <div className="container">
                    {
                        this.props.visibility[0].visibility
                            ? <ProductListing products={this.state.products}/>
                            : <h3>No products yet.</h3>
                    }
                    
                </div>
                <Footer />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        product: state.product,
        visibility: state.visibility,
        authentication: state.authentication
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateProduct: (value) => {
            dispatch({ type: 'UPDATE_PRODUCT', payload: value})
        },
        addProducts: (value) => {
            dispatch({ type: 'ADD_PRODUCTS', payload: value})
        },
        resetProduct: () => {
            dispatch({ type: 'RESET_APP'})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);