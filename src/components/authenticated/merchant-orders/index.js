import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Navigation from '../../navigation';
import Footer from '../../footer';
import UploadOrders from './upload-orders';
import Pagination from '../../pagination';
import OrderList from './order-list';
import OrderItem from './order-item';
import config from '../../../config/config';
import { convertTime } from '../../../components/utils/helpers';
import UpdateSurvey from './update-survey';

class MerchantOrders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: config.per_page,
            currentPage: 1,
            loadOrdersError: '',
            orders: [],
            order: [],
            pages: []
        }
        this.onView = this.onView.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onChangePagination = this.onChangePagination.bind(this);
    }

    fetchMerchantOrders() {
        fetch(config.site_url + '/api/morders/all', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				currentPage: this.state.currentPage,
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

                        let surveyItems = [];
                        if(value.customer_survey != undefined) {
                            let surveyArray = value.customer_survey.split("_");
                            surveyItems.push({
                                iffront: surveyArray[0],
                                stars: surveyArray[1],
                                comment: surveyArray[2]
                            });
                        }

                        arrayArgs.push({
                            id: value['orderid'],
                            date: convertTime(value['created_at']),
                            name: value['name'],
                            email: value['email'],
                            address: value['shipping_address'],
                            city: value['shipping_city'],
                            state: value['shipping_state'],
                            zip: value['shipping_zip'],
                            proids: value['product_ids'],
                            numofs: value['number_ofs'],
                            prices: value['prices'],
                            orderitems: orderItems,
                            surveyitems: surveyItems
                        });
                    }
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

    fetchPages() {
        fetch(config.site_url + '/api/database/pagination', {
            method: 'POST',
            headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
                db: "orders",
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
        this.fetchMerchantOrders();
    }

    getOrderObject(orderId) {
        let obj={};
        this.state.orders.map(order => {
            //console.log(order.id + ", " + orderId);
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
                obj.surveyitems = order.surveyitems;
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
            this.fetchMerchantOrders();
        }
    }

    onView(e) {
        //this.setState({ order: this.getOrderObject(e.target.dataset.orderid) });
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
                    this.props.updateMOrders({
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
        //this.props.resetMOrders();
        if(this.props.authentication[0].authenticated) {
            return (
                <div>
                    <Navigation
                        path="/merchant-orders"
                        authenticated={this.props.authentication[0].authenticated}
                        role={this.props.authentication[0].role}
                    />
                    <div className="container">
                        <div className="row my-3">
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                <h2>Merchant Orders</h2>
                                <Pagination
                                    pages={this.state.pages}
                                    perPage={this.state.perPage}
                                    currentPage={this.state.currentPage}
                                    onChangePagination={this.onChangePagination}
                                />
                                    <OrderList
                                        orders={this.state.orders}
                                        onView={this.onView}
                                        onDelete={this.onDelete}
                                    />
                                <Pagination
                                    pages={this.state.pages}
                                    perPage={this.state.perPage}
                                    currentPage={this.state.currentPage}
                                    onChangePagination={this.onChangePagination}
                                />
                                {
                                    (this.state.loadOrdersError) ? (
                                        <label>{this.state.loadOrdersError}</label>
                                    ) : (null)
                                }
                                <UploadOrders cart={this.props.cart} orders={this.props.morders}/>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                <OrderItem order={this.props.morders} />
                                <UpdateSurvey orders={this.props.morders} /> 
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