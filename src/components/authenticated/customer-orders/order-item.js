import React from 'react';

export default function OrderItem(props) {
    return (
        <div className="row mt-3">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            {
                props.order.map(item =>
                    <div className="row" key={item.id}>
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            <div className="row">
                                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                    <h4>Ship to: {item.name}</h4>
                                    <p>{item.email}</p>
                                    <p>{item.address}</p>
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
                                        <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 text-left">
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