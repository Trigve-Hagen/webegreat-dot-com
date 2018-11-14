import React from 'react';
import { connect } from 'react-redux';
import config from '../../../config/config';

class OrderItem extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
            mordersSurveyUpdateError: '',
            mordersSurveyUpdateIfFront: '',
		}
        this.onChange= this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    /*componentDidUpdate(nextProps, nextState) {
        let newProps = false, iffront = 0;
        nextProps.orders.map(order => {
            if(order.id == nextProps.orderItem) {
                if(order.surveyitems[0].iffront !== this.state.mordersSurveyUpdateIfFront) {
                    iffront = order.surveyitems[0].iffront;
                    newProps = true;
                }
            }
        })
        //console.log(nextState);
        if(newProps) {
            this.setState({
                mordersSurveyUpdateIfFront: iffront
            });
        }
    }*/

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

	onSubmit(e) {
        e.preventDefault();
        const data = new FormData();
            data.append('id', this.props.orderItem);
            data.append('iffront', this.state.mordersSurveyUpdateIfFront);
            data.append('token', this.props.authentication[0].token);

		fetch(config.site_url + '/api/morders/updateSurvey', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    console.log("User survey successfull." + json.iffront);
					this.setState({
                        mordersSurveyUpdateError: json.message,
                        mordersSurveyUpdateIfFront: json.iffront
                    });
                    location.reload();
				} else {
                    this.setState({
						mordersSurveyUpdateError: json.message
					});
                }
			});
    }

    render() {
        console.log(this.props.order)
        return (
            <div className="row mt-3">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    {
                        this.props.order.map(item => {
                            return <div className="row" key={item.id}>
                                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                    <div className="row">
                                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                            <h4 className="mb-1">Ship to: {item.name}</h4>
                                            <p className="mb-1">{item.email}</p>
                                            <p className="mb-1">{item.address}</p>
                                            <p>{item.city}, {item.state} {item.zip}</p>
                                        </div>
                                    </div>
                                    {
                                        item.orderitems.map(product =>
                                            <div className="row mt-3" key={product.id}>
                                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
                                                    <img
                                                        src={ `/img/products/${product.image}` }
                                                        alt="Army Strong" className="img-fluid"
                                                    />
                                                </div>
                                                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12">
                                                    <h4 className="mb-1">{product.name}</h4>
                                                    <p className="mb-1">Price: {product.price}</p>
                                                    <p className="mb-1">Quantity: {product.quantity}</p>
                                                    <p>Total: {product.total}</p>
                                                </div>
                                            </div>
                                        )
                                    }
                                    {
                                        item.surveyitems
                                            ? item.surveyitems.map((item, index) => {
                                                    return <div className="mt-3" key={index}>
                                                        <div className="row">
                                                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                                                {
                                                                    item.stars.map((element, index) => 
                                                                        <img
                                                                            src="/img/greenstar-md.png"
                                                                            key={index}
                                                                            style={{ maxWidth: '50px' }}
                                                                            className="img-fluid"
                                                                        />
                                                                    )
                                                                }
                                                                <p className="mb-1">{item.comment}</p>
                                                                <p>
                                                                    {
                                                                        item.iffront == 1
                                                                            ? 'Showing in referrals'
                                                                            : 'Not Showing in referrals'
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <h4>Set if showing in referals.</h4>
                                                        <div className="row">
                                                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                                                {
                                                                    (this.state.mordersSurveyUpdateError) ? (
                                                                        <label>{this.state.mordersSurveyUpdateError}</label>
                                                                    ) : (null)
                                                                }
                                                                <form name="cSurveyUpload" onSubmit={this.onSubmit}>
                                                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                                                        <div className="form-group">
                                                                            <select
                                                                                value={this.state.mordersSurveyUpdateIfFront}
                                                                                onChange={this.onChange}
                                                                                name="mordersSurveyUpdateIfFront"
                                                                                className="form-element custom"
                                                                            >
                                                                                <option value="">Please select a value.</option>
                                                                                <option value="0">Don't show in front.</option>
                                                                                <option value="1">Show in front.</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <button type="submit" className="btn btn-army">Update Survey</button>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            ) : null
                                    }
                                </div>
                            </div> }
                        )
                    }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        authentication: state.authentication
    }
}

export default connect(mapStateToProps)(OrderItem);