import React from 'react';
import { connect } from 'react-redux';
import config from '../../../config/config';
import states from '../../../data/states';

function uniqueId(id) {
    return parseInt(id) - (50 * 2);
}

function reverseId(id) {
    return parseInt(id) + (50 * 2);
}

class UploadOrders extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
            mordersUploadError: '',
            mordersUploadUser: '',
            mordersUploadUsers: [],
            mordersUploadId: '',
            mordersUploadName: '',
            mordersUploadEmail: '',
            mordersUploadAddress: '',
            mordersUploadCity: '',
            mordersUploadState: '',
            mordersUploadZip: ''
		}
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSwitchUserChange = this.onSwitchUserChange.bind(this);
    }

    componentDidMount() {
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
                    console.log(arrayArgs);
                    this.setState({
                        mordersUploadError: json.message,
                        mordersUploadUser: uniqueId(arrayArgs[0].id),
                        mordersUploadId: arrayArgs[0].id,
                        mordersUploadName: arrayArgs[0].name,
                        mordersUploadEmail: arrayArgs[0].email,
                        mordersUploadAddress: arrayArgs[0].address,
                        mordersUploadCity: arrayArgs[0].city,
                        mordersUploadState: arrayArgs[0].state,
                        mordersUploadZip: arrayArgs[0].zip,
                        mordersUploadUsers: arrayArgs
                    });
                } else {
                    this.setState({
                        mordersUploadError: json.message
                    });
                }
            });
    }

    getUserObject(userid) {
        let obj={};
        this.state.mordersUploadUsers.map(user => {
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
            mordersUploadId: user.id,
            mordersUploadName: user.name,
            mordersUploadEmail: user.email,
            mordersUploadAddress: user.address,
            mordersUploadCity: user.city,
            mordersUploadState: user.state,
            mordersUploadZip: user.zip,
            mordersUploadUser: e.target.value
        });
    }
    
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

	onSubmit(e) {
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
        const data = new FormData();
            data.append('id', this.state.mordersUploadId);
            data.append('name', this.state.mordersUploadName);
            data.append('email', this.state.mordersUploadEmail);
            data.append('address', this.state.mordersUploadAddress);
			data.append('city', this.state.mordersUploadCity);
            data.append('state', this.state.mordersUploadState);
            data.append('zip', this.state.mordersUploadZip);
            data.append('orderitems', cartString);
            data.append('proids', mordersProids);
            data.append('numofs', mordersNumofs);
            data.append('prices', mordersPrices);
            data.append('token', this.props.authentication[0].token);

		fetch(config.site_url + '/api/morders/upload', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
					console.log("User upload successfull.");
					this.props.updateMOrders({
                        id: json.transid,
                        name: json.name,
                        email: json.email,
                        address: json.address,
                        city: json.city,
                        state: json.state,
                        zip: json.zip,
                        proids: json.proids,
                        numofs: json.numofs,
                        prices: json.prices,
                        orderitems: json.orderitems
                    });
					this.setState({
                        mordersUploadError: json.message,
                        mordersUploadName: '',
                        mordersUploadEmail: '',
                        mordersUploadAddress: '',
                        mordersUploadCity: '',
                        mordersUploadState: '',
                        mordersUploadZip: '',
                        mordersUploadItems: '',
                        mordersUploadNumofs: '',
                        mordersUploadPrices: ''
                    });
                    location.reload();
				} else {
                    this.setState({
						mordersUploadError: json.message
					});
                }
			});
	}

    render() {
        return (
			<div>
                <h3>Order Upload</h3>
                <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 my-3">
                        <div className="form-group">
                            <select value={this.state.mordersUploadUser} onChange={this.onSwitchUserChange} name="onSwitchUserChange" className="form-element custom">
                                <option value="">Please select a value.</option>
                                {
                                    this.state.mordersUploadUsers.map(user =>
                                        <option
                                            key={uniqueId(user.id)}
                                            value={uniqueId(user.id)}
                                        >
                                            {uniqueId(user.id)} - {user.name}
                                        </option>
                                    )
                                }
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 my-3">
                        {
                            this.props.cart.map(item =>
                                <div className="row" key={item.id}>
                                    <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                                        <img src={ `/img/products/${item.image}` } alt="Army Strong" className="img-fluid"/>
                                    </div>
                                    <div className="col-xl-9 col-lg-9 col-md-9 col-sm-12">
                                        <h4 className="mb-1">{item.name}</h4>
                                        <p className="mb-1">Quantity: {item.quantity}</p>
                                        <p>Price: {item.price}</p>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        {
                            (this.state.mordersUploadError) ? (
                                <label>{this.state.mordersUploadError}</label>
                            ) : (null)
                        }
                        <form name="userUpload" onSubmit={this.onSubmit}>
                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                <fieldset className="form-group">
                                    <input value={this.state.mordersUploadName} onChange={this.onChange} name="mordersUploadName" type="text" className="form-element" placeholder="Name"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input value={this.state.mordersUploadEmail} onChange={this.onChange} name="mordersUploadEmail" type="email" className="form-element" placeholder="Email"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input value={this.state.mordersUploadAddress} onChange={this.onChange} name="mordersUploadAddress" type="text" className="form-element" placeholder="Address"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input value={this.state.mordersUploadCity} onChange={this.onChange} name="mordersUploadCity" type="text" className="form-element" placeholder="City"/>
                                </fieldset>
                                <div className="form-group">
                                    <select value={this.state.mordersUploadState} onChange={this.onChange} name="mordersUploadState" className="form-element custom">
                                        {states.map(state => <option key={state.abrev} value={state.abrev}>{state.name}</option>)}
                                    </select>
                                </div>
                                <fieldset className="form-group">
                                    <input value={this.state.mordersUploadZip} onChange={this.onChange} name="mordersUploadZip" type="text" className="form-element" placeholder="Zip"/>
                                </fieldset>
                            </div>
                            <button type="submit" className="btn btn-army">Merchant Orders Upload</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        //role: state.role,
        morders: state.morders,
        authentication: state.authentication
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateMOrders: (value) => {
            dispatch({ type: 'UPDATE_MORDER', payload: value})
        },
        resetMOrders: (value) => {
            dispatch({ type: 'RESET_MORDER', payload: value})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadOrders);