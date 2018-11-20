import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Navigation from '../../navigation';
import Footer from '../../footer';
import UploadOrders from './upload-orders';
import Pagination from '../../pagination';
import OrderList from './order-list';
import UpdateSurvey from './update-survey';
import OrderItem from './order-item';
import config from '../../../config/config';
import { convertTime } from '../../../components/utils/helpers';

class MerchantOrders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: config.per_page,
            currentPage: 1,
            loadOrdersError: '',
            surveyId: '',
            orders: [],
            order: [],
            pages: []
        }
        this.onView = this.onView.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onChangePagination = this.onChangePagination.bind(this);
        this.updateStateUploadOrder = this.updateStateUploadOrder.bind(this);
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
                            surveyid: value['survey_id'],
                            orderitems: orderItems
                        });
                        //count++;
                    }
					this.setState({
                        loadOrdersError: json.message,
                        orders: arrayArgs,
                        order: [arrayArgs[0]],
                        orderId: arrayArgs[0].id,
                        surveyId: arrayArgs[0].surveyid
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
                        loadOrdersError: json.message
					});
				} else {
                    this.setState({
                        loadOrdersError: json.message
					});
                }
			});
    }
    
    componentDidMount() {
        this.fetchMerchantOrders();
        this.fetchPages();
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
                obj.surveyid = order.surveyid;
                obj.orderitems = order.orderitems;
            }
        });
        return obj;
    }

    onChangePagination(e) {
        if(e.target.dataset.currentpage !== undefined) {
            this.setState({ currentPage: e.target.dataset.currentpage });
        }
    }

    updateStateUploadOrder() {
        e.preventDefault()
        this.setState({
            orders: this.state.orders
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.currentPage !== this.state.currentPage || prevState.orders.length !== this.state.orders.length) {
            this.fetchPages();
            this.fetchMerchantOrders();
        }
    }

    onView(e) {
        let orderObj = this.getOrderObject(e.target.dataset.orderid);
        this.setState({
            order: [orderObj],
            surveyId: orderObj.surveyid
        });
    }

    onDelete(e) {
        let orderId = e.target.dataset.orderid;
        let productObject = this.getOrderObject(orderId);
        if (confirm(`Are you sure you want to delete ${productObject.id}, ${productObject.name}?`)) {
            fetch(config.site_url + '/api/morders/delete', {
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
                                <h3>Merchant Orders</h3>
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
                                <UploadOrders
                                    cart={this.props.cart}
                                    orders={this.state.orders}
                                    updateState={this.updateStateUploadOrder}
                                />
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                <OrderItem order={this.state.order}/>
                                <UpdateSurvey surveyId={this.state.surveyId}/>
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
        authentication: state.authentication
    }
}

export default connect(mapStateToProps)(MerchantOrders)