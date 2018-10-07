import React from 'react';
import { connect } from 'react-redux';
import config from '../../../config/config';

class UploadMenu extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
            menuUploadError: '',
            menuUploadName: '',
            menuUploadParent: '',
            menuUploadLevel: '',
            menuUploadIfProduct: '',
            menuUploadDescription: ''
		}
        this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
    }
    
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

	onSubmit(e) {
		e.preventDefault();
        
        const data = new FormData();
            data.append('name', this.state.menuUploadName);
            data.append('parent', this.state.menuUploadParent);
            data.append('level', this.state.menuUploadLevel);
            data.append('description', this.state.menuUploadDescription);
            data.append('ifproduct', this.state.menuUploadIfProduct);
            data.append('token', this.props.authentication[0].token);

		fetch(config.site_url + '/api/menu/upload', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
					console.log("Product upload successfull.");
					this.props.updateMenu({
                        id: json.id,
                        name: json.name,
                        parent: json.parent,
                        level: json.level,
                        description: json.description,
                        ifproduct: json.ifproduct
                    });
					this.setState({
                        menuUploadError: json.message,
                        menuUploadName: '',
                        menuUploadParent: '',
                        menuUploadLevel: '',
                        menuUploadIfProduct: '',
                        menuUploadDescription: ''
                    });
				} else {
                    this.setState({
						menuUploadError: json.message
					});
                }
			});
	}

    render() {
        return (
			<div>
                <h3>Menu Upload</h3>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        {
                            (this.state.menuUploadError) ? (
                                <label>{this.state.menuUploadError}</label>
                            ) : (null)
                        }
                        <form name="menuUpload" onSubmit={this.onSubmit}>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                                <fieldset className="form-group">
                                    <input value={this.state.menuUploadName} onChange={this.onChange} name="menuUploadName" type="text" className="form-element" placeholder="Menu Level Name"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <select value={this.state.menuUploadLevel} onChange={this.onChange} name="menuUploadLevel" className="form-element custom">
                                        <option value="">Choose its menu level</option>
                                        <option value="0">Level One</option>
                                        <option value="1">Level Two</option>
                                        <option value="2">Level Three</option>
                                    </select>
                                </fieldset>
                                <fieldset className="form-group">
                                    <select value={this.state.menuUploadParent} onChange={this.onChange} name="menuUploadParent" className="form-element custom">
                                        <option value="">Choose the parent level</option>
                                        <option value="base">Base Level</option>
                                        {
                                            this.props.menuItems.filter(item => 
                                                    item.level == 0 || item.level == 1 || item.level == 2 && !item.ifproduct).map(item =>
                                                        <option key={item.id} value={item.name}>{item.name}</option>
                                                )
                                        }
                                    </select>
                                </fieldset>
                                <fieldset className="form-group">
                                    <select value={this.state.menuUploadIfProduct} onChange={this.onChange} name="menuUploadIfProduct" className="form-element custom">
                                        <option value="">Choose if product link or catagory</option>
                                        <option value="0">Category</option>
                                        <option value="1">Product Link</option>
                                    </select>
                                </fieldset>
                                <fieldset className="form-group">
                                    <textarea value={this.state.menuUploadDescription} onChange={this.onChange} name="menuUploadDescription" className="form-element" rows="3" placeholder="Description"/>
                                </fieldset>
                            </div>
                            <button type="submit" className="btn btn-army">Menu Upload</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        menu: state.menu,
        authentication: state.authentication
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateMenu: (value) => {
            dispatch({ type: 'UPDATE_MENU', payload: value})
        },
        resetMenu: (value) => {
            dispatch({ type: 'RESET_MENU', payload: value})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadMenu);