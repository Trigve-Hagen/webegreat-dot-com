import React from 'react';

export default function ProductItem(props) {
    return <div className="row margin-top-20px">
        <div className="col-lg-3 col-md-3 col-sm-12">
            <img
                alt={ props.product[0].name }
                src={ `/img/products/${ props.product[0].image }` }
                className="img-fluid"
            />
        </div>
        <div className="col-lg-9 col-md-9 col-sm-12 col-xs-24">
            <h3 className="margin-bottom-5px">{ props.product[0].name }</h3>
            <p className="margin-bottom-5px">{ props.product[0].description }</p>
            <p className="margin-bottom-5px">${ props.product[0].price }</p>
            <div className="product-button">
                <button className="btn btn-army">+ (0)</button>
            </div>
        </div>
    </div>
}