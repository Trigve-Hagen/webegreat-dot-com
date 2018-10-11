import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Navigation from '../../navigation';
import Footer from '../../footer';
import UploadOrders from './upload-orders';
import OrderList from './order-list';
import OrderItem from './order-item';
import config from '../../../config/config';

class MerchantOrders extends React.Component {
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
		fetch(config.site_url + '/api/morders/all', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				currentPage: this.props.pagination[0].currentPage,
                perPage: this.state.perPage,
                token: this.props.authentication[0].token
			})
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    let arrayArgs = [];
                    for (let value of Object.values(json.orders)) {
                        let orderItems = [];
                        let argsArray = value.items.split("&");
                        //console.log(argsArray);
                        for(let h=0; h<argsArray.length; h++) {
                            let orderArgs = argsArray[h].split("_");
                            //console.log(orderArgs.length);
                            orderItems.push({
                                id: orderArgs[0],
                                name: orderArgs[1],
                                sku: orderArgs[2],
                                price: orderArgs[3],
                                quantity: orderArgs[4],
                                image: orderArgs[5],
                                stock: orderArgs[6],
                                total: orderArgs[7]
                            });
                        }
                        arrayArgs.push({
                            id: value['orderid'],
                            date: value['create_at'],
                            name: value['name'],
                            email: value['email'],
                            address: value['shipping_address'],
                            city: value['shipping_city'],
                            state: value['shipping_state'],
                            zip: value['shipping_zip'],
                            proids: value['product_ids'],
                            numofs: value['number_ofs'],
                            prices: value['prices'],
                            orderitems: orderItems
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

    getOrderObject(orderId) {
        let obj={};
        this.state.orders.map(order => {
            if(order.id == orderId) {
                obj.id = order.id;
                obj.date = order.date;
                obj.name = order.name;
                obj.email = order.email;
                obj.address = order.address;
                obj.city = order.city;
                obj.state = order.state;
                obj.zip = order.zip;
                obj.proids = order.proids;
                obj.numofs = order.numofs;
                obj.prices = order.prices;
                obj.orderitems = order.orderitems;
            }
        });
        return obj;
    }

    onView(e) {
        this.props.updateMOrders(this.getOrderObject(e.target.dataset.orderid));
    }

    onDelete(e) {
        let orderId = e.target.dataset.orderid;
        let productObject = this.getOrderObject(orderId);
        if (confirm(`Are you sure you want to delete ${productObject.id}, ${productObject.name}?`)) {
            fetch(config.site_url + '/api/morders/delete-order', {
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
                        if(orderId != order.id) {
                            arrayArgs.push({
                                id: order.id,
                                date: order.date,
                                name: order.name,
                                email: order.email,
                                address: order.address,
                                city: order.city,
                                state: order.state,
                                zip: order.zip,
                                proids: order.proids,
                                numofs: order.numofs,
                                prices: order.prices
                            });
                        }
                    });
                    this.setState({
                        loadOrdersError: json.message,
                        orders: arrayArgs
                    });
                    this.props.updateCOrders({
                        id: arrayArgs[0].id,
                        date: arrayArgs[0].date,
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
                    <Navigation path="/merchant-orders" authenticated={this.props.authentication[0].authenticated} role={this.props.authentication[0].role}/>
                    <div className="container">
                        <div className="row space-top-20px space-bottom-50px">
                            <div className="col-lg-12 col-md-12 col-sm-12 col xs-24">
                                <div className="col-lg-6 col-md-6 col-sm-12 col xs-24">
                                    <OrderList
                                        orders={this.state.orders}
                                        onView={this.onView}
                                        onDelete={this.onDelete}
                                    />
                                    {
                                        (this.state.loadOrdersError) ? (
                                            <label>{this.state.loadOrdersError}</label>
                                        ) : (null)
                                    }
                                    <UploadOrders cart={this.props.cart} orders={this.props.morders}/>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 col xs-24">
                                    <OrderItem order={this.props.morders} />
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
        cart: state.cart,
        morders: state.morders,
        pagination: state.pagination,
        authentication: state.authentication
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateMOrders: (value) => {
            dispatch({ type: 'UPDATE_MORDERS', payload: value})
        },
        resetMOrders: (value) => {
            dispatch({ type: 'RESET_MORDERS', payload: value})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MerchantOrders)