import React from 'react';
import { connect } from 'react-redux';
import ProductListing from '../product-listing';
import Navigation from '../navigation';
import Footer from '../footer';
import config from '../../config/config';
import MenuDisplay from '../authenticated/menu/menu-display';
import SearchBar from '../../components/search-bar';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 15,
            currentPage: 1,
            loadProductError: '',
            searchString: '',
            products: []
        }
    }

    setSearchParam(searchString) {
        this.setState({ searchString: searchString });
        this.updateSearch({ searchString: searchString });
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
                searchString: this.state.searchString
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
                            name: value['name'],
                            price: value['price'],
                            stock: value['stock'],
                            ifmanaged: value['managed_stock'],
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

    render() {
        //this.props.resetProduct();
        return (
            <div>
                <Navigation
                    path="/"
                    authenticated={this.props.authentication[0].authenticated}
                    role={this.props.authentication[0].role}
                />
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                                <SearchBar onSubmit={this.setSearchParam}/>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-24">
                                <MenuDisplay />
                            </div>
                            <div className="col-lg-8 col-md-8 col-sm-12 col-xs-24">
                                {
                                    this.props.visibility[0].visibility
                                        ? <ProductListing products={this.state.products}/>
                                        : <h3>No products yet.</h3>
                                } 
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        search: state.search,
        product: state.product,
        visibility: state.visibility,
        authentication: state.authentication
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateSearch: (value) => {
            dispatch({ type: 'UPDATE_SEARCH', payload: value})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);