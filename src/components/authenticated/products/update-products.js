import React from 'react';
import { connect } from 'react-redux';

class UpdateProducts extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
			proUpdateError: '',
            proUpdateName: '',
            proUpdatePrice: '',
            proUpdateDescription: '',
            updateInput: '',
            fileName: ''
		}
		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(e) {
		e.preventDefault();
        
        const data = new FormData();
            data.append('file', this.state.updateInput.files[0]);
            data.append('filename', this.state.fileName.value);
            data.append('proid', this.props.product[0].id);
            data.append('imagename', this.props.product[0].image);
            data.append('name', this.state.proUpdateName.value);
			data.append('description', this.state.proUpdateDescription.value);
            data.append('price', this.state.proUpdatePrice.value);
            data.append('token', this.props.authentication[0].token);

        //console.log("Description: "+this.state.proUpdateDescription.value);

		fetch('http://localhost:4000/api/product/update', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    console.log("Successfull Product Update.");
                    let obj = {}
                    obj['id'] = this.props.product[0].id;
                    if(json.name != '') obj['name']=json.name;
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
                        proUpdateName: json.name != '' ? json.name : this.props.product[0].name,
                        proUpdatePrice: json.price != '' ? json.price : this.props.product[0].price,
                        proUpdateDescription: json.description != '' ? json.description : this.props.product[0].description,
                        updateInput: '',
                        fileName: imagename[0]
                    });
                    location.reload();
				} else {
                    console.log(json.message);
                    this.setState({
						proUpdateError: json.message
					});
                }
			});
	}

    render() {
        //this.props.resetProduct();
        const valueObj = {
            filename: this.props.product[0].image.split(".")[0],
            proUpdateName: this.props.product[0].name,
            proUpdatePrice: this.props.product[0].price,
            proUpdateDescription: this.props.product[0].description,
        }
        return (
			<div>
                <h3>Product Update</h3>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        {
                            (this.state.proUpdateError) ? (
                                <label>{this.state.proUpdateError}</label>
                            ) : (null)
                        }
                        <form name="proUpdate" onSubmit={this.onSubmit}>
                            <fieldset className="form-group">
                                <input ref={(ref) => { this.state.updateInput = ref; }} type="file" className="form-control-file btn btn-army"/>
                            </fieldset>
                            <fieldset className="form-group">
                                <input ref={(ref) => { this.state.fileName = ref; }} type="text" className="form-element" placeholder="desired-name-of-file" />
                            </fieldset>
                            <fieldset className="form-group">
                                <input ref={(ref) => { this.state.proUpdateName = ref; }} type="text" className="form-element" placeholder="Name"/>
                            </fieldset>
                            <fieldset className="form-group">
                                <input ref={(ref) => { this.state.proUpdatePrice = ref; }} type="text" className="form-element" placeholder="0.00"/>
                            </fieldset>
                            <fieldset className="form-group">
                                <textarea ref={(ref) => { this.state.proUpdateDescription = ref; }} className="form-element" rows="3" placeholder="Description"/>
                            </fieldset>
                            <button type="submit" className="btn btn-army">Product Update</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        product: state.product,
        authentication: state.authentication
    }
}

function mapDispatchToProps(dispatch) {
    return {
        resetProduct: (value) => {
            dispatch({ type: 'RESET_PRODUCT', payload: value})
        },
        updateProduct: (value) => {
            dispatch({ type: 'UPDATE_PRODUCT', payload: value})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProducts);