import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Navigation from '../../navigation';
import Footer from '../../footer';
import UploadSurvey from './upload-survey';
import Pagination from '../../pagination';
import OrderList from './order-list';
import OrderItem from './order-item';
import config from '../../../config/config';
import { convertTime } from '../../../components/utils/helpers';

class CustomerOrders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: config.per_page,
            currentPage: 1,
            loadOrdersError: '',
            windowHeight: 0,
            footerHeight: 0,
            menuHeight: 0,
            orderItem: '',
            orders: [],
            order: [],
            pages: []
        }
        this.onView = this.onView.bind(this);
        this.onChangePagination = this.onChangePagination.bind(this);
    }

    fetchOrders() {
        fetch(config.site_url + '/api/corders/all', {
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
                            orderitems: orderItems
                        });
                    }
					this.setState({
                        loadOrdersError: json.message,
                        orders: arrayArgs,
                        order: arrayArgs[0],
                        orderItem: arrayArgs[0].id
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
                token: this.props.authentication[0].token,
				perPage: this.state.perPage
			})
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    if(json.pages) {
                        let range = [];
                        for(let i = 1; i <= json.pages; i++) range.push(i);
                        this.setState({
                            pages: range,
                            loadProductError: json.message
                        });
                    }
				} else {
                    this.setState({
                        loadProductError: json.message
					});
                }
			});
    }
    
    componentDidMount() {
        let windowHeight = isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight;
        let footerHeight = document.getElementsByClassName('webegreat-footer')[0].clientHeight;
        let menuHeight = document.getElementsByClassName('webegreat-menu')[0].clientHeight;
        this.setState({
            windowHeight: windowHeight,
            footerHeight: footerHeight,
            menuHeight: menuHeight
        });
        this.fetchPages();
		this.fetchOrders();
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
            this.fetchOrders();
        }
    }

    onView(e) {
        this.setState({ order: this.getOrderObject(e.target.dataset.orderid) })
    }

    render() {
        let containerHeight = this.state.windowHeight - (this.state.menuHeight + this.state.footerHeight);
        console.log(containerHeight)
        if(this.props.authentication[0].authenticated && this.props.authentication[0].role == 1) {
            return (
                <div>
                    <Navigation
                        path="/customer-orders"
                        authenticated={this.props.authentication[0].authenticated}
                        role={this.props.authentication[0].role}
                    />
                    <div
                        className="container"
                        style={{
                            minHeight: containerHeight + 'px'
                        }}
                    >
                        <div className="row my-3">
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                <h3>Customer Orders</h3>
                                {
                                    (this.state.loadOrdersError) ? (
                                        <label>{this.state.loadOrdersError}</label>
                                    ) : (null)
                                }
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
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                <OrderItem order={this.state.orders} />
                                <UploadSurvey orderId={this.state.orderItem}/>
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
        authentication: state.authentication
    }
}

export default connect(mapStateToProps)(CustomerOrders)