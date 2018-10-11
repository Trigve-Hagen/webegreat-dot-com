import React from 'react';

function uniqueId(id) {
    return parseInt(id) - 50 * 2;
}

export default function UserItem(props) {
    let folder = uniqueId(props.user[0].id);
    return <div className="row margin-top-20px">
        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-24 text-center">
            <img
                alt={ props.user[0].name }
                src={ `/img/avatar/${folder}/${props.user[0].image}` }
                className="img-responsive"
            />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-24">
            <h3>Name: { props.user[0].name }</h3>
            <p>Role: { props.user[0].role }</p>
            <p>If Active: { props.user[0].ifactive }</p>
            <p>Email: { props.user[0].email }</p>
            <p>Address: { props.user[0].address }</p>
            <p>City: { props.user[0].city }</p>
            <p>State: { props.user[0].state }</p>
            <p>Zip: { props.user[0].zip }</p>   
        </div>
    </div>
}