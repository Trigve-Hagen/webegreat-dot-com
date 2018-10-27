import React from 'react';

export default function ProductItem(props) {
    if(props.product == []) {
        return <div><h3>There are no products yet.</h3></div>
    } else {
        return <div className="row margin-top-20px">
            <div className="col-lg-3 col-md-3 col-sm-12">
                <img
                    alt={ props.product.name }
                    src={ `/img/products/${ props.product.image }` }
                    className="img-fluid"
                />
            </div>
            <div className="col-lg-9 col-md-9 col-sm-12 col-xs-24">
                <h3 className="margin-bottom-5px">{ props.product.name }</h3>
                <p className="margin-bottom-5px">{ props.product.description }</p>
                <p className="margin-bottom-5px">${ props.product.price }</p>
                <div className="product-button">
                    <button className="btn btn-army">+ (0)</button>
                </div>
            </div>
        </div>
    }
}