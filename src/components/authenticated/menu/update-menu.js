import React from 'react';
import { connect } from 'react-redux';
import config from '../../../config/config';

class UpdateMenu extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
            menuUpdateError: '',
            menuUpdateId: '',
            menuUpdateName: '',
            menuUpdateLevel: '',
            menuUpdateParent: '',
            menuUpdateIfProduct: '',
            menuUpdateDescription: ''
		}
        this.onChange= this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    
    componentDidUpdate(nextProps) {
        if(nextProps.menu.id !== this.props.menu.id) {
            this.setState({
                menuUpdateId: this.props.menu.id,
                menuUpdateName: this.props.menu.name,
                menuUpdateLevel: this.props.menu.level,
                menuUpdateParent: this.props.menu.parent,
                menuUpdateIfProduct: this.props.menu.ifproduct,
                menuUpdateDescription: this.props.menu.description
            });
        }
    }

	onSubmit(e) {
		e.preventDefault();
        
        const data = new FormData();
            data.append('name', this.state.menuUpdateName);
            data.append('parent', this.state.menuUpdateParent);
            data.append('level', this.state.menuUpdateLevel);
            data.append('ifproduct', this.state.menuUpdateIfProduct);
            data.append('description', this.state.menuUpdateDescription);
            data.append('id', this.state.menuUpdateId);
            data.append('token', this.props.authentication[0].token);

        //console.log("Description: "+this.state.proUpdateDescription.value);

		fetch(config.site_url + '/api/menu/update', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    console.log("Successfull Menu Update.");
                    console.log(json.message);
                    this.props.updateMenu({
                        id: json.id,
                        name: json.name,
                        level: json.level,
                        parent: json.parent,
                        description: json.description,
                        ifproduct: json.ifproduct
                    });
					this.setState({
                        menuUpdateError: json.message,
                        menuUpdateId: json.id,
                        menuUpdateName: json.name,
                        menuUpdateLevel: json.level,
                        menuUpdateParent: json.parent,
                        menuUpdateIfProduct: json.ifproduct,
                        menuUpdateDescription: json.description,
                    });
                    location.reload();
				} else {
                    this.setState({
						menuUpdateError: json.message
					});
                }
			});
	}

    render() {
        return (
            <div className="row margin-bottom-50px">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                    <h3>Menu Update</h3>
                    {
                        (this.state.menuUpdateError) ? (
                            <label>{this.state.menuUpdateError}</label>
                        ) : (null)
                    }
                    <form name="menuUpload" onSubmit={this.onSubmit}>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                            <fieldset className="form-group">
                                <input value={this.state.menuUpdateName} onChange={this.onChange} name="menuUpdateName" type="text" className="form-element" placeholder="Menu Level Name"/>
                            </fieldset>
                            <fieldset className="form-group">
                                <select value={this.state.menuUpdateLevel} onChange={this.onChange} name="menuUpdateLevel" className="form-element custom">
                                    <option value="">Choose its menu level</option>
                                    <option value="0">Level One</option>
                                    <option value="1">Level Two</option>
                                    <option value="2">Level Three</option>
                                </select>
                            </fieldset>
                            <fieldset className="form-group">
                                <select value={this.state.menuUpdateParent} onChange={this.onChange} name="menuUpdateParent" className="form-element custom">
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
                                <select value={this.state.menuUpdateIfProduct} onChange={this.onChange} name="menuUpdateIfProduct" className="form-element custom">
                                    <option value="">Choose if product link or catagory</option>
                                    <option value="0">Category</option>
                                    <option value="1">Product Link</option>
                                </select>
                            </fieldset>
                            <fieldset className="form-group">
                                <textarea value={this.state.menuUpdateDescription} onChange={this.onChange} name="menuUpdateDescription" className="form-element" rows="3" placeholder="Description"/>
                            </fieldset>
                        </div>
                        <button type="submit" className="btn btn-army">Menu Update</button>
                    </form>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        authentication: state.authentication
    }
}

export default connect(mapStateToProps)(UpdateMenu);