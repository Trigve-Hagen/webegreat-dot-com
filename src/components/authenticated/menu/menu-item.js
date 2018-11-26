import React from 'react';

export default function MenuItem(props) {
    return <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 text-center">
                <h3 className="mb-1">{props.menu.name}</h3>
                <p>{props.menu.description}</p>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 text-center">
                <h3 className="mb-1">Level: {props.menu.level + 1}</h3>
                <p className="mb-1">Parent: {props.menu.parent}</p>
                <p>If Product Link:
                    {
                        props.menu.ifproduct
                            ? ' Link to products'
                            : ' No link'
                    }
                </p>
            </div>
        </div>
}