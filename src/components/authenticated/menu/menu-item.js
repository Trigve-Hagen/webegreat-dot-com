import React from 'react';

export default function MenuItem(props) {
    return <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-24 text-center">
                    <h3 className="margin-bottom-5px">{props.menu[0].name}</h3>
                    <p>{props.menu[0].description}</p>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-24 text-center">
                    <h3 className="margin-bottom-5px">Level: {props.menu[0].level}</h3>
                    <p className="margin-bottom-5px">Parent: {props.menu[0].parent}</p>
                    <p>If Product Link:
                        {
                            props.menu[0].ifproduct
                                ? ' Link to products'
                                : ' No link'
                        }
                    </p>
                </div>
            </div>
}