import React from 'react';

const style = {
    marginTop: '20px'
}

export default function ProductItem(props) {
    return <div className="row" style={style}>
        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-24 text-center">
            <img
                alt={ props.product[0].name }
                src={ `/img/products/${ props.product[0].image }` }
                className="img-responsive"
            />
        </div>
        <div className="col-lg-9 col-md-9 col-sm-12 col-xs-24">
            <h3>{ props.product[0].name }</h3>
            <p>{ props.product[0].description }</p>
            <div className="product-price">
                <p>${ props.product[0].price }</p>
            </div>
            <div className="product-button">
            <button className="btn btn-army">Add To Cart (0)</button>
            </div>
        </div>
    </div>
}