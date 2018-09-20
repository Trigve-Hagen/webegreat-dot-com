import React from 'react';
import { connect } from 'react-redux';

class UploadProducts extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
			proUploadError: '',
            proUploadName: '',
            proUploadPrice: '',
            proUploadDescription: '',
            proUploadImageUrl: '',
            uploadInput: '',
            fileName: ''
		}

		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(e) {
		e.preventDefault();
        
        const data = new FormData();
            data.append('file', this.state.uploadInput.files[0]);
            data.append('filename', this.state.fileName.value);
            data.append('name', this.state.proUploadName.value);
			data.append('description', this.state.proUploadDescription.value);
            data.append('price', this.state.proUploadPrice.value);
            data.append('token', this.props.authentication[0].token);

		fetch('http://localhost:4000/api/product/upload', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
					console.log("Product upload successfull.");
					this.props.updateProduct({
                        id: json.id,
                        name: json.name,
                        price: json.price,
                        description: json.description,
                        image: json.image
                    });
					this.setState({
						proUploadError: json.message,
                        proUploadName: '',
                        proUploadPrice: '',
                        proUploadDescription: '',
                        proUploadImageUrl: '',
                        uploadInput: '',
                        fileName: ''
                    });
				} else {
                    console.log(json.message);
                    this.setState({
						proUploadError: json.message
					});
                }
			});
	}

    render() {
        //const{ proUploadError } = this.state;
        return (
			<div>
                <h2>Product Upload</h2>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        {
                            (this.state.proUploadError) ? (
                                <label>{this.state.proUploadError}</label>
                            ) : (null)
                        }
                        <img src={this.state.proUploadImageUrl} className="img-responsive" alt="img" />
                        <form name="proUpload" onSubmit={this.onSubmit}>
                            <fieldset className="form-group">
                                <input ref={(ref) => { this.state.uploadInput = ref; }} type="file" className="form-control-file btn btn-army"/>
                            </fieldset>
                            <fieldset className="form-group">
                                <input ref={(ref) => { this.state.fileName = ref; }} type="text" className="form-element" placeholder="desired-name-of-file" />
                            </fieldset>
                            <fieldset className="form-group">
                                <input ref={(ref) => { this.state.proUploadName = ref; }} type="text" className="form-element" placeholder="Name"/>
                            </fieldset>
                            <fieldset className="form-group">
                                <input ref={(ref) => { this.state.proUploadPrice = ref; }} type="text" className="form-element" placeholder="0.00"/>
                            </fieldset>
                            <fieldset className="form-group">
                                <textarea ref={(ref) => { this.state.proUploadDescription = ref; }} className="form-element" rows="3" placeholder="Description"/>
                            </fieldset>
                            <button type="submit" className="btn btn-army">Product Upload</button>
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
        updateProduct: (value) => {
            dispatch({ type: 'UPDATE_PRODUCT', payload: value})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadProducts);