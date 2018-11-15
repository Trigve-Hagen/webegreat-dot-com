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

class MerchantOrders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: config.per_page,
            currentPage: 1,
            loadOrdersError: '',
            orderItem: '',
            orderIfFront: '',
            orders: [],
            order: [],
            pages: []
        }
        this.onView = this.onView.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onChangePagination = this.onChangePagination.bind(this);
        this.onSurveySubmit = this.onSurveySubmit.bind(this);
    }

    onSurveySubmit(e) {
        //console.log(e.target.dataset.orderifsurvey);
        e.preventDefault();
        const data = new FormData();
            data.append('id', this.state.orderItem);
            data.append('iffront', e.target.dataset.orderifsurvey);
            data.append('token', this.props.authentication[0].token);

		fetch(config.site_url + '/api/morders/updateSurvey', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    console.log("User survey successfull." + json.iffront);
					this.setState({
                        loadOrdersError: json.message,
                        orderIfFront: json.iffront
                    });
                    //location.reload();
				} else {
                    this.setState({
						loadOrdersError: json.message
					});
                }
			});
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
                            let range = [];
                            for(let i = 1; i <= surveyArray[1]; i++) range.push(i);
                            surveyItems.push({
                                iffront: surveyArray[0],
                                stars: range,
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
                        //count++;
                    }
					this.setState({
                        loadOrdersError: json.message,
                        orders: arrayArgs,
                        orderIfFront: arrayArgs[0].surveyitems[0].iffront,
                        orderItem: arrayArgs[0].id,
                        order: [arrayArgs[0]]
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
        if(prevState.currentPage !== this.state.currentPage || prevState.orderIfFront !== this.state.orderIfFront) {
            this.setState({ currentPage: this.state.currentPage, orderIfFront: this.state.orderIfFront });
            this.fetchPages();
            this.fetchMerchantOrders();
        }
    }

    onView(e) {
        let orderObj = this.getOrderObject(e.target.dataset.orderid);
        this.setState({
            order: [orderObj],
            orderItem: orderObj.id,
            orderIfFront: orderObj.surveyitems[0].iffront
        });
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
        console.log(this.state.orderIfFront);
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
                                <UploadOrders cart={this.props.cart} orders={this.state.orders}/>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                <OrderItem
                                    order={this.state.order}
                                    ifFront={this.state.orderIfFront}
                                    orderItem={this.state.orderItem}
                                    onSubmit={this.onSurveySubmit}
                                />
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