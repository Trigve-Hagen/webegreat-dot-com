import React from 'react';
import { connect } from 'react-redux';
import config from '../../../config/config';

class OrderItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        //console.log(this.state.products);
        return (
            <div className="row margin-top-20px">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24 text-center">
                {
                    this.props.order.map(item =>
                        <div className="row" key={item.id}>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-24">
                                        <h4>Ship to:</h4>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-12 col-xs-24">
                                        <h4>{item.name}</h4>
                                        <p>{item.email}</p>
                                        <p>{item.address}</p>
                                        <p>{item.city}, {item.state} {item.zip}</p>
                                    </div>
                                </div>
                                {
                                    item.orderitems.map(product =>
                                        <div className="row margin-top-20px" key={product.id}>
                                            <div className="col-lg-3 col-md-3 col-sm-12 col-xs-24">
                                                <img
                                                    src={ `/img/products/${product.image}` }
                                                    alt="Army Strong" className="img-responsive"
                                                />
                                            </div>
                                            <div className="col-lg-9 col-md-9 col-sm-12 col-xs-24 text-left">
                                                <h4>{product.name}</h4>
                                                <p>Price: {product.price}</p>
                                                <p>Quantity: {product.quantity}</p>
                                                <p>Total: {product.total}</p>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    )
                }
                {
                    this.props.order.map((product, index) =>
                        <div className="row" key={index}>
                            <div className="col-lg-3 col-md-3 col-sm-12 col-xs-24">
                                <img
                                    src={ `/img/products/${product.orderitems.image}` }
                                    alt="Army Strong" className="img-responsive"
                                />
                            </div>
                            <div className="col-lg-9 col-md-9 col-sm-12 col-xs-24 text-left">
                                <h4>{product.orderitems.name}</h4>
                                <p>{product.orderitems.description}</p>
                                <p>Id: {product.orderitems.productid}</p>
                                <p>Price: {product.orderitems.price}</p>
                                <p>Quantity: {product.orderitems.quantity}</p>
                                <p>Total: {product.orderitems.total}</p>
                            </div>
                        </div>
                    )
                }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        morders: state.morders,
        authentication: state.authentication
    }
}


export default connect(mapStateToProps)(OrderItem)