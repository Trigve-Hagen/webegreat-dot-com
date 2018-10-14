import React from 'react';
import { connect } from 'react-redux';
import ProductListing from '../product-listing';
import Navigation from '../navigation';
import Footer from '../footer';
import config from '../../config/config';
import MenuDisplay from '../authenticated/menu/menu-display';

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
        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
	}

    onClick(e) {
        e.preventDefault();
        console.log(e.target.dataset.linkname);
    }

    onSubmit(e) {
        e.preventDefault();
        console.log(this.state.searchString);
        //this.updateSearch({ searchString: this.state.searchString });
        /*e.preventDefault();
        
        const data = new FormData();
            data.append('role', this.state.userUploadRole);
            data.append('name', this.state.userUploadName);
            data.append('email', this.state.userUploadEmail);
            data.append('address', this.state.userUploadAddress);
			data.append('city', this.state.userUploadCity);
            data.append('state', this.state.userUploadState);
            data.append('zip', this.state.userUploadZip);
            data.append('ifactive', this.state.userUploadIfActive);
            data.append('password', this.state.userUploadPassword);
            data.append('token', this.props.authentication[0].token);

		fetch(config.site_url + '/api/roles/upload', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
					console.log("User upload successfull.");
					this.props.updateRole({
                        id: json.id,
                        role : json.role,
                        name: json.name,
                        email: json.email,
                        address: json.address,
                        city: json.city,
                        state: json.state,
                        zip: json.zip,
                        ifactive: json.ifactive,
                        image: 'user-avatar.jpg'
                    });
					this.setState({
                        userUploadError: json.message,
                        userUploadRole: '',
                        userUploadName: '',
                        userUploadEmail: '',
                        userUploadAddress: '',
                        userUploadCity: '',
                        userUploadState: '',
                        userUploadZip: '',
                        userUploadIfActive: '',
                        userUploadPassword: ''
                    });
				} else {
                    this.setState({
						userUploadError: json.message
					});
                }
			});*/
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
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24 margin-top-20px">
                                {
                                    (this.state.searchError) ? (
                                        <label>{this.state.searchError}</label>
                                    ) : (null)
                                }
                                <form name="search" onSubmit={this.onSubmit}>
                                    <div className="input-group">
                                        <input value={this.state.searchString} onChange={this.onChange} name="searchString" type="text" className="form-element" placeholder="Search for..." />
                                        <span className="input-group-btn">
                                            <button className="btn btn-army" type="submit">Go!</button>
                                        </span>
                                    </div>
                                </form>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-24">
                                <MenuDisplay onClick={this.onClick}/>
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