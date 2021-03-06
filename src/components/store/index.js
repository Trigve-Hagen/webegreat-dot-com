import React from 'react';
import { connect } from 'react-redux';
import ProductListing from '../product-listing';
import Navigation from '../navigation';
import Footer from '../footer';
import config from '../../config/config';
import MenuDisplay from '../authenticated/menu/menu-display';
import SearchBar from '../search-bar';
import Referrals from './referrals';
import Chat from '../chat';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 15,
            currentPage: 1,
            loadProductError: '',
            loadMenuItems: [],
            searchString: 'all',
            windowHeight: 0,
            footerHeight: 0,
            menuHeight: 0,
            products: []
        }
        this.onClick = this.onClick.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onClick(e) {
        e.preventDefault();
        this.searchProducts(e.target.dataset.linkname);
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.updateSearch({ searchString: e.target.dataset.searchstring });
        this.searchProducts(e.target.dataset.searchstring);
    }

    componentDidMount() {
        this.searchProducts(this.state.searchString);
        this.getMenu();
        let windowHeight = isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight;
        let footerHeight = document.getElementsByClassName('webegreat-footer')[0].clientHeight;
        let menuHeight = document.getElementsByClassName('webegreat-menu')[0].clientHeight;
        this.setState({
            windowHeight: windowHeight,
            footerHeight: footerHeight,
            menuHeight: menuHeight
        });
    }

    getMenu() {
		fetch(config.site_url + '/api/menu/front', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: this.props.authentication[0].token
			})
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    let arrayArgs = [];
                    for (let value of Object.values(json.menuItems)) {
                        if(value['if_active'] == 1 && value['if_dropdown'] == 0) {
                            arrayArgs.push({
                                id: value['menuid'],
                                name: value['name'],
                                level: value['level'],
                                parent: value['parent'],
                                description: value['description'],
                                ifproduct: value['if_product'],
                                ifactive: value['if_active'],
                                ifdropdown: value['if_dropdown']
                            });
                        }
                    }
                    //console.log(arrayArgs);
                    this.setState({
                        loadProductError: json.message,
                        loadMenuItems: arrayArgs
                    });
				} else {
                    this.setState({
						loadProductError: json.message
					});
                }
			});
    }

    searchProducts(searchString) {
        fetch(config.site_url + '/api/product/front', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				currentPage: this.state.currentPage,
                perPage: this.state.perPage,
                searchString: searchString
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
        let containerHeight = this.state.windowHeight - (this.state.menuHeight + this.state.footerHeight);
        return (
            <div>
                <Navigation
                    path="/store"
                    authenticated={this.props.authentication[0].authenticated}
                    role={this.props.authentication[0].role}
                    onClick={this.onClick}
                />
                <div
                    className="container"
                    style={{
                        minHeight: containerHeight + 'px'
                    }}
                >
                    <div className="row">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            <SearchBar onSubmit={this.onSubmit}/>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
                            {
                                this.props.visibility[0].visibility == 1
                                    ? <Chat />
                                    : <div></div>
                            }
                            {
                                this.props.visibility[0].visibility == 1
                                    ? <MenuDisplay onClick={this.onClick} menuItems={this.state.loadMenuItems}/>
                                    : <div></div>
                            }
                            {
                                this.props.visibility[0].visibility == 1
                                    ? <Referrals authenticated={this.props.authentication[0].authenticated} />
                                    : <div></div>
                            }
                        </div>
                        <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12">
                            {
                                this.props.visibility[0].visibility == 1
                                    ? <ProductListing products={this.state.products}/>
                                    : <h3>No products yet.</h3>
                            } 
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