import React from 'react';
import { uniqueId } from '../../../components/utils/helpers';
import states from '../../../data/states';

export default function UploadOrders(props) {
    return <div>
            <h3>Order Upload</h3>
            <div className="row">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 my-3">
                    <div className="form-group">
                        <select value={props.user} onChange={props.onSwitchUser} name="uploadUser" className="form-element custom">
                            <option value="">Please select a value.</option>
                            {
                                props.users.map(user =>
                                    <option
                                        key={uniqueId(user.id)}
                                        value={uniqueId(user.id)}
                                    >
                                        {uniqueId(user.id)} - {user.name}
                                    </option>
                                )
                            }
                        </select>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 my-3">
                    {
                        props.cart.map(item =>
                            <div className="row" key={item.id}>
                                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                                    <img src={ `/img/products/${item.image}` } alt="Army Strong" className="img-fluid"/>
                                </div>
                                <div className="col-xl-9 col-lg-9 col-md-9 col-sm-12">
                                    <h5 className="mb-1">{item.name}</h5>
                                    <p className="mb-1">Quantity: {item.quantity}</p>
                                    <p>Price: {item.price}</p>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            <div className="row">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    {
                        (props.error) ? (
                            <label>{props.error}</label>
                        ) : (null)
                    }
                    <form name="userUpload" onSubmit={props.onUploadSubmit}>
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            <fieldset className="form-group">
                                <input
                                    value={props.name}
                                    onChange={props.onUploadChange}
                                    name="uploadName"
                                    type="text"
                                    className="form-element"
                                    placeholder="Name"
                                />
                            </fieldset>
                            <fieldset className="form-group">
                                <input
                                    value={props.email}
                                    onChange={props.onUploadChange}
                                    name="uploadEmail"
                                    type="email"
                                    className="form-element"
                                    placeholder="Email"
                                />
                            </fieldset>
                            <fieldset className="form-group">
                                <input
                                    value={props.address}
                                    onChange={props.onUploadChange}
                                    name="uploadAddress"
                                    type="text"
                                    className="form-element"
                                    placeholder="Address"
                                />
                            </fieldset>
                            <fieldset className="form-group">
                                <input
                                    value={props.city}
                                    onChange={props.onUploadChange}
                                    name="uploadCity"
                                    type="text"
                                    className="form-element"
                                    placeholder="City"
                                />
                            </fieldset>
                            <div className="form-group">
                                <select
                                    value={props.state}
                                    onChange={props.onUploadChange}
                                    name="uploadState"
                                    className="form-element custom"
                                >
                                    {states.map(state => <option key={state.abrev} value={state.abrev}>{state.name}</option>)}
                                </select>
                            </div>
                            <fieldset className="form-group">
                                <input
                                    value={props.zip}
                                    onChange={props.onUploadChange}
                                    name="uploadZip"
                                    type="text"
                                    className="form-element"
                                    placeholder="Zip"
                                />
                            </fieldset>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-army"
                        >
                            Merchant Orders Upload
                        </button>
                    </form>
                </div>
            </div>
        </div>
}