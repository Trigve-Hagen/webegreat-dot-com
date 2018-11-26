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
import { convertTime, uniqueId, reverseId } from '../../../components/utils/helpers';

class MerchantOrders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: config.per_page,
            currentPage: 1,
            loadOrdersError: '',
            uploadError: '',
            uploadUser: '',
            uploadUsers: [],
            uploadId: '',
            uploadName: '',
            uploadEmail: '',
            uploadAddress: '',
            uploadCity: '',
            uploadState: '',
            uploadZip: '',
            surveyId: '',
            orders: [],
            order: [],
            pages: []
        }
        this.onView = this.onView.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onChangeUpload = this.onChangeUpload.bind(this);
        this.onSubmitUpload = this.onSubmitUpload.bind(this);
        this.onChangePagination = this.onChangePagination.bind(this);
        this.onSwitchUserChange = this.onSwitchUserChange.bind(this);
    }

    fetchUsers() {
        fetch(config.site_url + '/api/morders/getusers', {
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
                    //console.log(json.users);
                    for (let value of Object.values(json.users)) {
                        arrayArgs.push({
                            id: value['userid'],
                            image: value['avatar'],
                            role: value['role'],
                            name: value['name'],
                            email: value['email'],
                            address: value['shipping_address'],
                            city: value['shipping_city'],
                            state: value['shipping_state'],
                            zip: value['shipping_zip'],
                            ifactive: value['store_visible']
                        });
                    }
                    this.setState({
                        uploadError: json.message,
                        uploadUser: uniqueId(arrayArgs[0].id),
                        uploadId: arrayArgs[0].id,
                        uploadName: arrayArgs[0].name,
                        uploadEmail: arrayArgs[0].email,
                        uploadAddress: arrayArgs[0].address,
                        uploadCity: arrayArgs[0].city,
                        uploadState: arrayArgs[0].state,
                        uploadZip: arrayArgs[0].zip,
                        uploadUsers: arrayArgs
                    });
                } else {
                    this.setState({
                        uploadError: json.message
                    });
                }
            });
    }

    getUserObject(userid) {
        let obj={};
        this.state.uploadUsers.map(user => {
            if(user.id == userid) {
                obj.id = user.id;
                obj.name = user.name;
                obj.email = user.email;
                obj.address = user.address;
                obj.city = user.city;
                obj.state = user.state;
                obj.zip = user.zip;
            }
        });
        return obj;
    }

    onSwitchUserChange(e) {
        let user = this.getUserObject(reverseId(e.target.value));
        this.setState({
            uploadId: user.id,
            uploadName: user.name,
            uploadEmail: user.email,
            uploadAddress: user.address,
            uploadCity: user.city,
            uploadState: user.state,
            uploadZip: user.zip,
            uploadUser: e.target.value
        });
    }

    onChangeUpload(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmitUpload(e) {
        e.preventDefault();
        let proids = [], numofs = [], prices = [];
        function createArrays(item) {
            proids.push(item.id);
            numofs.push(item.quantity);
            prices.push(item.price);
        }
        this.props.cart.forEach(createArrays);
        let mordersProids = proids.join("_");
        let mordersNumofs = numofs.join("_");
        let mordersPrices = prices.join("_");
        //console.log(mordersItems + ", " + mordersNumofs + ", " + mordersPrices)
        let cartCount = 0; let cartString = '';
        this.props.cart.map(item => {
            if(cartCount == this.props.cart.length - 1) cartString += item.id + "_" + item.name + "_" + item.sku + "_" + item.price + "_" + item.quantity + "_" + item.image + "_" + item.stock + "_" + (parseInt(item.quantity) * parseFloat(item.price)).toFixed(2);
            else cartString += item.id + "_" + item.name + "_" + item.sku + "_" + item.price + "_" + item.quantity + "_" + item.image + "_" + item.stock + "_" + (parseInt(item.quantity) * parseFloat(item.price)).toFixed(2) + "&";
            cartCount++;
        });
        //console.log(cartString);

		fetch(config.site_url + '/api/morders/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.state.uploadId,
                name: this.state.uploadName,
                email: this.state.uploadEmail,
                address: this.state.uploadAddress,
                city: this.state.uploadCity,
                state: this.state.uploadState,
                zip: this.state.uploadZip,
                orderitems: cartString,
                proids: mordersProids,
                numofs: mordersNumofs,
                prices: mordersPrices,
                token: this.props.authentication[0].token
            })
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
					console.log("User upload successfull.");
					this.setState({
                        uploadError: json.message
                    });
                    this.fetchMerchantOrders();
                    this.fetchPages();
				} else {
                    this.setState({
						uploadError: json.message
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
                            loadOrdersError: json.message,
                            orders: [],
                            order: [],
                            orderId: '',
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
        this.fetchUsers();
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
                    this.fetchPages();
                    this.fetchMerchantOrders();
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
                                    error={this.state.uploadError}
                                    user={this.state.uploadUser}
                                    users={this.state.uploadUsers}
                                    name={this.state.uploadName}
                                    email={this.state.uploadEmail}
                                    address={this.state.uploadAddress}
                                    city={this.state.uploadCity}
                                    state={this.state.uploadState}
                                    zip={this.state.uploadZip}
                                    onSwitchUser={this.onSwitchUserChange}
                                    onUploadChange={this.onChangeUpload}
                                    onUploadSubmit={this.onSubmitUpload}
                                />
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                {
                                    this.state.order.length == 0
                                        ?   <div><h4>There are no orders yet.</h4></div>
                                        :   <div>
                                                <OrderItem order={this.state.order}/>
                                                <UpdateSurvey surveyId={this.state.surveyId}/>
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
        cart: state.cart,
        authentication: state.authentication
    }
}

export default connect(mapStateToProps)(MerchantOrders)