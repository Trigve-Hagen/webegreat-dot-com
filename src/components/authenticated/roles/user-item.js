import React from 'react';

function uniqueId(id) {
    return parseInt(id) - 50 * 2;
}

export default function UserItem(props) {
    let folder = uniqueId(props.user.id);
    return <div className="row mt-3">
        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 text-center">
            <img
                alt={ props.user.name }
                src={ `/img/avatar/${folder}/${props.user.image}` }
                className="img-fluid"
            />
        </div>
        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <h4 className="mb-1">Name: { props.user.name }</h4>
            <p className="mb-1">Role: { props.user.role }</p>
            <p className="mb-1">If Active: { props.user.ifactive }</p>
            <p className="mb-1">Email: { props.user.email }</p>
            <p className="mb-1">Address: { props.user.address }</p>
            <p className="mb-1">City: { props.user.city }</p>
            <p className="mb-1">State: { props.user.state }</p>
            <p>Zip: { props.user.zip }</p>   
        </div>
    </div>
}