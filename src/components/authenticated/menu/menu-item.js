import React from 'react';

export default function MenuItem(props) {
    if(props.menu == []) {
        return <div><h4>No menu items uploaded.</h4></div>
    } else {
        return <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-24 text-center">
                    <h3 className="margin-bottom-5px">{props.menu.name}</h3>
                    <p>{props.menu.description}</p>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-24 text-center">
                    <h3 className="margin-bottom-5px">Level: {props.menu.level}</h3>
                    <p className="margin-bottom-5px">Parent: {props.menu.parent}</p>
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
}