import React from 'react';

const style = {
    marginTop: '20px'
}

export default function UserItem(props) {
    return <div className="row" style={style}>
        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-24 text-center">
            <img
                alt={ props.user[0].name }
                src={ `/img/products/${ props.user[0].image }` }
                className="img-responsive"
            />
        </div>
        <div className="col-lg-9 col-md-9 col-sm-12 col-xs-24">
            <h3>Name: { props.user[0].name }</h3>
            <p>Email: { props.user[0].email }</p>
            <p>Address: { props.user[0].address }</p>
            <p>City: { props.user[0].city }</p>
            <p>State: { props.user[0].state }</p>
            <p>Zip: { props.user[0].zip }</p>
            <p>Role: { props.user[0].role }</p>
            <p>Passsword: { props.user[0].password }</p>
        </div>
    </div>
}