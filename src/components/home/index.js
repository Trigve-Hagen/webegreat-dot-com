import React from 'react';
import { connect } from 'react-redux';
import ProductListing from '../product-listing';
//import products from '../../data/products';
import Navigation from '../navigation';
import Footer from '../footer';

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
		fetch('http://localhost:4000/api/product/front', {
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
                    //console.log("Successfull Product Query.");
                    //console.log(json + ", json " + json.message);
                    //console.log(json.products);
                    let results = json.products.map( product => ({
                        id: product['productid'],
                        image: product['image'],
                        name: product['name'],
                        price: product['price'],
                        description: product['description']
                    }));
                    /*this.props.addProducts(results);
                    //this.props.updateProduct();
					this.setState({
                        loadProductError: json.message,
                        products: results
					});*/
				} else {
                    console.log("Eroor: " + json.message)
                    this.setState({
						loadProductError: json.message
					});
                }
			});
    }

    render() {
        console.log(this.state.products);
        //this.props.resetProduct();
        return (
            <div>
                <Navigation path="/" authenticated={this.props.authentication[0].authenticated}/>
                <div className="container">
                    <ProductListing products={this.props.product}/>
                </div>
                <Footer />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        product: state.product,
        authentication: state.authentication
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateProduct: (value) => {
            dispatch({ type: 'UPDATE_PRODUCT', paydate: value})
        },
        addProducts: (value) => {
            dispatch({ type: 'ADD_PRODUCTS', paydate: value})
        },
        resetProduct: () => {
            dispatch({ type: 'RESET_APP'})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);