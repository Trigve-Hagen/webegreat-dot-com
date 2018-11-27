import React from 'react';

export default function UpdateMenu(props) {
    return <div className="row mb-3">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                <h3>Menu Update</h3>
                {
                    (props.error) ? (
                        <label>{props.error}</label>
                    ) : (null)
                }
                <form name="menuUpload" onSubmit={props.onSubmitMenu}>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <fieldset className="form-group">
                            <input
                                value={props.name}
                                onChange={props.onChangeMenu}
                                name="menuUpdateName"
                                type="text"
                                className="form-element"
                                placeholder="Menu Level Name"
                            />
                        </fieldset>
                        <fieldset className="form-group">
                                <select
                                    value={props.ifactive}
                                    onChange={props.onChangeMenu}
                                    name="menuUpdateIfActive"
                                    className="form-element custom"
                                >
                                    <option value="">Choose if visiblie in the front menu.</option>
                                    <option value="0">Not Active</option>
                                    <option value="1">Active</option>
                                </select>
                            </fieldset>
                            <fieldset className="form-group">
                                <select
                                    value={props.ifdropdown}
                                    onChange={props.onChangeMenu}
                                    name="menuUpdateIfDropdown"
                                    className="form-element custom"
                                >
                                    <option value="">Choose menu type.</option>
                                    <option value="0">In Verticle Menu</option>
                                    <option value="1">In Dropdown Menu</option>
                                </select>
                            </fieldset>
                        <fieldset className="form-group">
                            <select
                                value={props.level}
                                onChange={props.onChangeMenu}
                                name="menuUpdateLevel"
                                className="form-element custom"
                            >
                                <option value="">Choose its menu level</option>
                                <option value="0">Level One</option>
                                <option value="1">Level Two</option>
                                <option value="2">Level Three</option>
                            </select>
                        </fieldset>
                        <fieldset className="form-group">
                            <select
                                value={props.parent}
                                onChange={props.onChangeMenu}
                                name="menuUpdateParent"
                                className="form-element custom"
                            >
                                <option value="">Choose the parent level</option>
                                <option value="base">Base Level</option>
                                {
                                    props.menuItems.filter(item => 
                                            item.level == 0 || item.level == 1 || item.level == 2 && !item.ifproduct).map(item =>
                                                <option key={item.id} value={item.name}>{item.name}</option>
                                        )
                                }
                            </select>
                        </fieldset>
                        <fieldset className="form-group">
                            <select
                                value={props.ifproduct}
                                onChange={props.onChangeMenu}
                                name="menuUpdateIfProduct"
                                className="form-element custom"
                            >
                                <option value="">Choose if product link or catagory</option>
                                <option value="0">Category</option>
                                <option value="1">Product Link</option>
                            </select>
                        </fieldset>
                        <fieldset className="form-group">
                            <textarea
                                value={props.desc}
                                onChange={props.onChangeMenu}
                                name="menuUpdateDescription"
                                className="form-element"
                                rows="3"
                                placeholder="Description"
                            />
                        </fieldset>
                    </div>
                    <button type="submit" className="btn btn-army">Menu Update</button>
                </form>
            </div>
        </div>
}