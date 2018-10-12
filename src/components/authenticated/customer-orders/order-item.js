import React from 'react';

class OrderItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
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
                                            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-24">
                                                <img
                                                    src={ `/img/products/${product.image}` }
                                                    alt="Army Strong" className="img-responsive"
                                                />
                                            </div>
                                            <div className="col-lg-8 col-md-8 col-sm-12 col-xs-24 text-left">
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
                </div>
            </div>
        )
    }
}


export default OrderItem;