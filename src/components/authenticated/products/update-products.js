import React from 'react';
import { connect } from 'react-redux';

class UpdateProducts extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
			ProUpdateError: '',
			ProUpdateName: '',
			ProUpdateDescription: '',
            ProUpdatePrice: '',
            productImageFile: ''
		}

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value});
	}

	onSubmit(e) {
		e.preventDefault();
		const {
			ProUpdateName,
			ProUpdateDescription,
            ProUpdatePrice,
            productImageFile
		} = this.state;

		fetch('http://localhost:4000/api/account/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: ProUpdateName,
				Description: ProUpdateDescription,
                Price: ProUpdatePrice,
                image: productImageFile
			})
		}).then(res => res.json())
			.then(json => {
				/*if(json.success) {
					console.log("Successfull Registration.");
					this.props.updateAuth({ authenticated: true, token: json.token });
					this.setState({
						redirect: true,
						ProUpdateError: json.message,
					});
					
				} else {
                    this.setState({
						ProUpdateError: json.message
					});
                }*/
			});
	}

    render() {
		const {
            productImageFile,
			ProUpdateDescription,
			ProUpdateError,
			ProUpdateName,
			ProUpdatePrice
		} = this.state;
        return (
			<div>
                <h2>Product Update</h2>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        {
                            (ProUpdateError) ? (
                                <label>{ProUpdateError}</label>
                            ) : (null)
                        }
                        <form name="ProUpdate" onSubmit={this.onSubmit}>
                            <fieldset className="form-group">
                                <input value={productImageFile} onChange={this.onChange} type="file" className="form-control-file btn btn-army"/>
                            </fieldset>
                            <fieldset className="form-group">
                                <input value={ProUpdateName} onChange={this.onChange} type="text" className="form-element" id="ProUpdateName" placeholder="Name"/>
                            </fieldset>
                            <fieldset className="form-group">
                                <input value={ProUpdatePrice} onChange={this.onChange} type="text" className="form-element" id="ProUpdatePrice" placeholder="0.00"/>
                            </fieldset>
                            <fieldset className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea className="form-element" value={ProUpdateDescription} onChange={this.onChange} id="description" rows="3">Description</textarea>
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
        authentication: state.authentication
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateAuth: (value) => {
            dispatch( { type: 'UPDATE_AUTH', payload: value} )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProducts);