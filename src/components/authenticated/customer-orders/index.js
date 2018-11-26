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
import { COPYFILE_FICLONE_FORCE } from 'constants';

class CustomerOrders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: config.per_page,
            surveyIfFront: '',
            surveyStarsArray: [],
            surveyStars: 0,
            surveyComment: '',
            currentPage: 1,
            loadOrdersError: '',
            windowHeight: 0,
            footerHeight: 0,
            menuHeight: 0,
            surveyId: '',
            orders: [],
            order: [],
            pages: []
        }
        this.onView = this.onView.bind(this);
        this.onSurveyChange = this.onSurveyChange.bind(this);
        this.onSurveySubmit = this.onSurveySubmit.bind(this);
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
                    if(json.orders.length > 0) {
                        for (let value of Object.values(json.orders)) {
                            let orderItems = [];
                            let argsArray = value.items.split("&");
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
                        }
                        this.setState({
                            loadOrdersError: json.message,
                            orders: arrayArgs,
                            order: [arrayArgs[0]],
                            surveyId: arrayArgs[0].surveyid
                        });
                        this.getSurvey(arrayArgs[0].surveyid);
                    } else {
                        this.setState({
                            loadOrdersError: json.message,
                            orders: [],
                            order: [],
                            surveyId: ''
                        });
                    }
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
                            loadOrdersError: json.message
                        });
                    }
				} else {
                    this.setState({
                        loadOrdersError: json.message
					});
                }
			});
    }
    
    componentDidMount() {
        this.fetchPages();
        this.fetchOrders();
        let windowHeight = isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight;
        let footerHeight = document.getElementsByClassName('webegreat-footer')[0].clientHeight;
        let menuHeight = document.getElementsByClassName('webegreat-menu')[0].clientHeight;
        this.setState({
            windowHeight: windowHeight,
            footerHeight: footerHeight,
            menuHeight: menuHeight
        });
    }

    getOrderObject(orderId) {
        let obj={};
        this.state.orders.map(order => {
            if(order.id == orderId) {
                console.log(order.surveyid);
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

    componentDidUpdate(prevProps, prevState) {
        if(prevState.currentPage !== this.state.currentPage) {
            this.setState({ currentPage: this.state.currentPage });
            this.fetchOrders();
            this.fetchPages();
        }
    }

    onView(e) {
        let orderObj = this.getOrderObject(e.target.dataset.orderid);
        this.getSurvey(orderObj.surveyid);
        this.setState({
            order: [orderObj],
            surveyId: orderObj.surveyid
        });
    }

    getSurvey(surveyId) {
        fetch(config.site_url + '/api/corders/getSurvey', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: surveyId,
                token: this.props.authentication[0].token
			})
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    let range = [];
                    for(let i = 1; i <= json.stars; i++) range.push(i);
					this.setState({
                        loadOrdersError: json.message,
                        surveyStarsArray: range,
                        surveyStars: json.stars,
                        surveyComment: json.comment
					});
				} else {
                    this.setState({
						loadOrdersError: json.message
					});
                }
			});
    }

    onSurveyChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSurveySubmit(e) {
        e.preventDefault();
		fetch(config.site_url + '/api/corders/survey', {
            method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
                id: this.state.surveyId,
                stars: this.state.surveyStars,
                comment: this.state.surveyComment,
                token: this.props.authentication[0].token
			})
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    let range = [];
                    for(let i = 1; i <= json.stars; i++) range.push(i);
					this.setState({
                        loadOrdersError: json.message,
                        surveyIfFront: json.iffront,
                        surveyStarsArray: range,
                        surveyStars: json.stars,
                        surveyComment: json.comment,
					});
				} else {
                    this.setState({
						loadOrdersError: json.message
					});
                }
			});
    }

    render() {
        let containerHeight = this.state.windowHeight - (this.state.menuHeight + this.state.footerHeight);
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
                                {
                                    this.state.order.length == 0
                                        ?   <div><h4>There are no orders yet.</h4></div>
                                        :   <div>
                                                <OrderItem order={this.state.order} />
                                                {
                                                    this.state.surveyStars.length == 0
                                                        ?   <div><h4>No survey yet.</h4></div>
                                                        :   <UploadSurvey
                                                                comment={this.state.surveyComment}
                                                                stars={this.state.surveyStars}
                                                                onChangeSurvey={this.onSurveyChange}
                                                                onSubmitSurvey={this.onSurveySubmit}
                                                            />
                                                }
                                                
                                            </div>
                                }
                                
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