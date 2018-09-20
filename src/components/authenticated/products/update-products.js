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
            proUpdateImageUrl: '',
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
            data.append('name', this.state.proUpdateName.value);
			data.append('description', this.state.proUpdateDescription.value);
            data.append('price', this.state.proUpdatePrice.value);
            data.append('token', this.props.authentication[0].token);

		fetch('http://localhost:4000/api/product/update', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
                this.setState({ proUpdateImageUrl: body.file });
				if(json.success) {
					console.log("Successfull Registration.");
					this.props.updateProduct({
                        id: json.id,
                        name: json.name,
                        price: json.price,
                        description: json.description,
                        image: json.image
                    });
					this.setState({
						proUpdateError: json.message,
                        proUpdateName: '',
                        proUpdatePrice: '',
                        proUpdateDescription: '',
                        proUpdateImageUrl: '',
                        updateInput: '',
                        fileName: ''
					});
				} else {
                    console.log(json.message);
                    this.setState({
						proUpdateError: json.message
					});
                }
			});
	}

    render() {
        const{ proUpdateError } = this.state;
        return (
			<div>
                <h2>Product Update</h2>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        {
                            (proUpdateError) ? (
                                <label>{proUpdateError}</label>
                            ) : (null)
                        }
                        <img src={this.state.proUpdateImageUrl} className="img-responsive" alt="img" />
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
        updateProduct: (value) => {
            dispatch({ type: 'UPDATE_PRODUCT', paydate: value})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProducts);