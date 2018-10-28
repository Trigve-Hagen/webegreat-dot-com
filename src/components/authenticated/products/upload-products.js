import React from 'react';
import { connect } from 'react-redux';
import config from '../../../config/config';

class UploadProducts extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
            proUploadError: '',
            proUploadMenu: '',
            proUploadName: '',
            proUploadSku: '',
            proUploadPrice: '',
            proUploadStock: '',
            proUploadIfManaged: '',
            proUploadDescription: '',
            uploadInput: '',
            fileName: '',
            links: []
		}
        this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        fetch(config.site_url + '/api/product/menulinks', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				token: this.props.authentication[0].token
			})
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    let arrayArgs = [];
                    for (let value of Object.values(json.links)) {
                        arrayArgs.push({
                            id: value['menuid'],
                            name: value['name']
                        });
                    }
					this.setState({
                        proUploadError: json.message,
                        links: arrayArgs
					});
				} else {
                    this.setState({
						proUploadError: json.message
					});
                }
			});
    }
    
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

	onSubmit(e) {
        e.preventDefault();
        // WARNING in asset size limit:
        // The following asset(s) exceed the recommended size limit (244 KiB).
        // So 244 X 1024 = 249856 because (bytes / 1024).toFixed(3) + " KB";
        // Please keep all images under 244KB of React recommended size limit.
        if(config.allowed_images.includes(this.state.uploadInput.files[0].type)) {
            if(this.state.uploadInput.files[0].size < 249856) {
                if(this.state.uploadInput.files[0].size > 0) {
                    const data = new FormData();
                        data.append('file', this.state.uploadInput.files[0]);
                        data.append('filename', this.state.fileName);
                        data.append('menu', this.state.proUploadMenu);
                        data.append('name', this.state.proUploadName);
                        data.append('sku', this.state.proUploadSku);
                        data.append('description', this.state.proUploadDescription);
                        data.append('price', this.state.proUploadPrice);
                        data.append('stock', this.state.proUploadStock);
                        data.append('ifmanaged', this.state.proUploadIfManaged);
                        data.append('token', this.props.authentication[0].token);

                    fetch(config.site_url + '/api/product/upload', {
                        method: 'POST',
                        body: data,
                    }).then(res => res.json())
                        .then(json => {
                            if(json.success) {
                                console.log("Product upload successfull.");
                                this.props.updateProduct({
                                    id: json.id,
                                    menu : json.menu,
                                    name: json.name,
                                    sku: json.sku,
                                    price: json.price,
                                    stock: json.stock,
                                    ifmanaged: json.ifmanaged,
                                    description: json.description,
                                    image: json.image
                                });
                                this.setState({
                                    proUploadError: json.message,
                                    proUploadMenu: '',
                                    proUploadName: '',
                                    proUploadSku: '',
                                    proUploadPrice: '',
                                    proUploadStock: '',
                                    proUploadIfManaged: '',
                                    proUploadDescription: '',
                                    uploadInput: '',
                                    fileName: ''
                                });
                            } else {
                                this.setState({
                                    proUploadError: json.message
                                });
                            }
                        });
                } else this.setState({ proUploadError: 'File is less than 0 bytes.' });
            } else this.setState({ proUploadError: 'File is bigger than 244 KB.' });
        } else this.setState({ proUploadError: 'Invalid image type. Jpeg, jpg, gif or pngs allowed.' });
	}

    render() {
        return (
			<div className="row margin-bottom-50px">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                    <h3>Product Upload</h3>
                    {
                        (this.state.proUploadError) ? (
                            <label>{this.state.proUploadError}</label>
                        ) : (null)
                    }
                    <form name="proUpload" onSubmit={this.onSubmit}>
                        <fieldset className="form-group">
                            <input ref={(ref) => { this.state.uploadInput = ref; }} type="file" className="form-control-file btn btn-army"/>
                        </fieldset>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                            <fieldset className="form-group">
                                <input value={this.state.fileName} onChange={this.onChange} name="fileName" type="text" className="form-element" placeholder="desired-name-of-file" />
                            </fieldset>
                            <div className="form-group">
                                <select value={this.state.proUploadMenu} onChange={this.onChange} name="proUploadMenu" className="form-element custom">
                                    <option value="">Please select a value.</option>
                                    {
                                        this.state.links.map(link =>
                                            <option key={link.id} value={link.name}>{link.name}</option>
                                        )
                                    }
                                </select>
                            </div>
                            <fieldset className="form-group">
                                <input value={this.state.proUploadName} onChange={this.onChange} name="proUploadName" type="text" className="form-element" placeholder="Name"/>
                            </fieldset>
                            <fieldset className="form-group">
                                <input value={this.state.proUploadSku} onChange={this.onChange} name="proUploadSku" type="text" className="form-element" placeholder="Sku"/>
                            </fieldset>
                            <fieldset className="form-group">
                                <input value={this.state.proUploadPrice} onChange={this.onChange} name="proUploadPrice" type="text" className="form-element" placeholder="0.00"/>
                            </fieldset>
                            <fieldset className="form-group">
                                <input value={this.state.proUploadStock} onChange={this.onChange} name="proUploadStock" type="text" className="form-element" placeholder="Number in Stock"/>
                            </fieldset>
                            <div className="form-group">
                                <select value={this.state.proUploadIfManaged} onChange={this.onChange} name="proUploadIfManaged" className="form-element custom">
                                    <option value="">Please select a value.</option>
                                    <option value="0">Always In Stock</option>
                                    <option value="1">Managed Stock</option>
                                </select>
                            </div>
                            <fieldset className="form-group">
                                <textarea value={this.state.proUploadDescription} onChange={this.onChange} name="proUploadDescription" className="form-element" rows="3" placeholder="Description"/>
                            </fieldset>
                        </div>
                        <button type="submit" className="btn btn-army">Product Upload</button>
                    </form>
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
        },
        resetProduct: (value) => {
            dispatch({ type: 'RESET_PRODUCT', payload: value})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadProducts);