import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Navigation from '../../navigation';
import Footer from '../../footer';
import UploadOrders from './upload-orders';
import OrdersList from './orders-list';
import config from '../../../config/config';

class CustomerOrders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 15,
            loadOrdersError: '',
            orders: []
        }
        this.onView = this.onView.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    componentDidMount() {
		fetch(config.site_url + '/api/corders/all', {
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
                    for (let value of Object.values(json.orders)) {
                        arrayArgs.push({
                            id: value['orderid'],
                            name: value['name'],
                            email: value['email'],
                            address: value['address'],
                            city: value['city'],
                            state: value['state'],
                            zip: value['zip'],
                            proids: value['proids'],
                            numofs: value['numofs'],
                            prices: value['prices']
                        });
                    }
                    //console.log(arrayArgs);
					this.setState({
                        loadOrdersError: json.message,
                        orders: arrayArgs
					});
				} else {
                    this.setState({
						loadOrdersError: json.message
					});
                }
			});
    }

    getProductObject(orderId) {
        let obj={};
        this.state.orders.map(order => {
            if(order.id == orderId) {
                obj.id = order.id;
                obj.name = order.name;
                obj.email = order.email;
                obj.address = order.address;
                obj.city = order.city;
                obj.state = order.state;
                obj.zip = order.zip;
                obj.proids = order.proids;
                obj.numofs = order.numofs;
                obj.prices = order.prices;
            }
        });
        return obj;
    }

    onView(e) {
        this.props.updateCOrders(this.getProductObject(e.target.dataset.orderid));
    }

    onDelete(e) {
        let orderId = e.target.dataset.orderid;
        let productObject = this.getProductObject(orderId);
        if (confirm(`Are you sure you want to delete ${productObject.id}, ${productObject.name}?`)) {
            fetch(config.site_url + '/api/corders/delete-order', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
                id: orderId,
                token: this.props.authentication[0].token
			})
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    let arrayArgs = [];
                    this.state.orders.map(order => {
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
                        loadOrdersError: json.message,
                        orders: arrayArgs
                    });
                    this.props.updateCOrders({
                        id: arrayArgs[0].id,
                        name: arrayArgs[0].name,
                        email: arrayArgs[0].email,
                        address: arrayArgs[0].address,
                        city: arrayArgs[0].city,
                        state: arrayArgs[0].state,
                        zip: arrayArgs[0].zip,
                        proids: arrayArgs[0].proids,
                        numofs: arrayArgs[0].numofs,
                        prices: arrayArgs[0].prices,
                    });
                    //location.reload();
				} else {
                    this.setState({
						loadOrdersError: json.message
					});
                }
			});
        }
    }

    render() {
        //this.props.resetCOrders();
        if(this.props.authentication[0].authenticated) {
            return (
                <div>
                    <Navigation path="/customer-orders" authenticated={this.props.authentication[0].authenticated} role={this.props.authentication[0].role}/>
                    <div className="container">
                        <div className="row space-top-20px space-bottom-50px">
                            <div className="col-lg-12 col-md-12 col-sm-12 col xs-24">
                                <h1>My Orders Page</h1>
                                <div className="col-lg-4 col-md-4 col-sm-12 col xs-24">
                                    <OrdersList
                                        orders={this.state.orders}
                                        onView={this.onView}
                                        onDelete={this.onDelete}
                                    />
                                    {
                                        (this.state.loadOrderError) ? (
                                            <label>{this.state.loadOrderError}</label>
                                        ) : (null)
                                    }
                                    <UploadOrders />
                                </div>
                                <div className="col-lg-8 col-md-8 col-sm-12 col xs-24">
                                </div>
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
        corders: state.corders,
        pagination: state.pagination,
        authentication: state.authentication
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateCOrders: (value) => {
            dispatch({ type: 'UPDATE_CORDERS', payload: value})
        },
        resetCOrders: (value) => {
            dispatch({ type: 'RESET_CORDERS', payload: value})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerOrders)