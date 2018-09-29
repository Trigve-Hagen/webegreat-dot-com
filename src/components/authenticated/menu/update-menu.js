import React from 'react';
import { connect } from 'react-redux';
import config from '../../../config/config';

class UpdateMenu extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
            menuUploadError: '',
            menuUploadId: '',
            menuUploadName: '',
            menuUploadParent: '',
            menuUploadLevel: '',
            menuUploadIfProduct: '',
		}

		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(e) {
		e.preventDefault();
        
        const data = new FormData();
            data.append('name', this.state.menuUploadName.value);
            data.append('parent', this.state.menuUploadParent.value);
            data.append('level', this.state.menuUploadLevel.value);
            data.append('ifproduct', this.state.menuUploadIfProduct.value);
            data.append('id', this.state.menuUploadId);
            data.append('token', this.props.authentication[0].token);

        //console.log("Description: "+this.state.proUpdateDescription.value);

		fetch(config.site_url + '/api/menu/update', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    console.log("Successfull Product Update.");
                    this.setState({
						menuUploadError: json.message
					});
                    /*let obj = {}
                    obj['id'] = this.props.product[0].id;
                    if(json.name != '') obj['name']=json.name;
                    obj['menu'] = this.props.product[0].menu;
                    if(json.menu != '') obj['menu']=json.menu;
                    else obj['name'] = this.props.product[0].name;
                    if(json.price != '') obj['price']=json.price;
                    else obj['price'] = this.props.product[0].price;
                    if(json.description != '') obj['description']=json.description;
                    else obj['description'] = this.props.product[0].description;
                    if(json.image != '') obj['image']=json.image;
                    else obj['image'] = this.props.product[0].image;

                    this.props.updateProduct(obj);
                    let imagename = obj.image.split(".");
					this.setState({
                        proUpdateError: json.message,
                        proUpdateName: json.menu != '' ? json.menu : this.props.product[0].menu,
                        proUpdateName: json.name != '' ? json.name : this.props.product[0].name,
                        proUpdatePrice: json.price != '' ? json.price : this.props.product[0].price,
                        proUpdateDescription: json.description != '' ? json.description : this.props.product[0].description,
                        updateInput: '',
                        fileName: imagename[0]
                    });
                    location.reload();*/
				} else {
                    //console.log(json.message);
                    this.setState({
						menuUploadError: json.message
					});
                }
			});
	}

    render() {
        return (
			<div>
                <h3>Menu Update</h3>
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
                                    <input ref={(ref) => { this.state.menuUploadName = ref; }} type="text" className="form-element" placeholder="Menu Level Name"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input ref={(ref) => { this.state.menuUploadLevel = ref; }} type="text" className="form-element" placeholder="Menu Level"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input ref={(ref) => { this.state.menuUploadParent = ref; }} type="text" className="form-element" placeholder="Parent Level"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input ref={(ref) => { this.state.menuUploadIfProduct = ref; }} type="text" className="form-element" placeholder="If Product or Category"/>
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

export default connect(mapStateToProps, mapDispatchToProps)(UpdateMenu);