import React from 'react';

export default function ProductItem(props) {
    console.log(props.product);
    if(props.product === [] || props.product === undefined) {
        return <div><h3>There are no products yet.</h3></div>
    } else {
        return <div className="row mt-3">
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                <img
                    alt={ props.product.name }
                    src={ `/img/products/${ props.product.image }` }
                    className="img-fluid"
                />
            </div>
            <div className="col-xl-9 col-lg-9 col-md-9 col-sm-12">
                <h3 className="mb-1">{ props.product.name }</h3>
                <p className="mb-1">{ props.product.description }</p>
                <p className="mb-1">${ props.product.price }</p>
                <div className="product-button">
                    <button className="btn btn-army">+ (0)</button>
                </div>
            </div>
        </div>
    }
}