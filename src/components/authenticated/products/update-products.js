import React from 'react';
import { connect } from 'react-redux';
import config from '../../../config/config';

class UpdateProducts extends React.Component {
    constructor(props) {
        super(props);
		this.state = {
            proUpdateError: '',
            proUpdateId: '',
            proUpdateMenu: '',
            proUpdateName: '',
            proUpdateSku: '',
            proUpdatePrice: '',
            proUpdateStock: '',
            proUpdateIfManaged: '',
            proUpdateDescription: '',
            updateInput: '',
            fileName: '',
            links: []
        }
        this.onChange= this.onChange.bind(this);
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

    componentDidUpdate(nextProps) {
        if(nextProps.product.id !== this.props.product.id) {
            this.setState({
                proUpdateId: this.props.product.id,
                proUpdateMenu: this.props.product.menu,
                proUpdateName: this.props.product.name,
                proUpdateSku: this.props.product.sku,
                proUpdatePrice: this.props.product.price,
                proUpdateStock: this.props.product.stock,
                proUpdateIfManaged: this.props.product.ifmanaged,
                proUpdateDescription: this.props.product.description,
                updateInput: '',
                fileName: this.props.product.image.split(".")[0]
            });
        }
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    submitUpdate() {
        const data = new FormData();
            data.append('file', this.state.updateInput.files[0]);
            data.append('filename', this.state.fileName);
            data.append('proid', this.props.product.id);
            data.append('imagename', this.props.product.image);
            data.append('menu', this.state.proUpdateMenu);
            data.append('name', this.state.proUpdateName);
            data.append('sku', this.state.proUpdateSku);
            data.append('description', this.state.proUpdateDescription);
            data.append('price', this.state.proUpdatePrice);
            data.append('stock', this.state.proUpdateStock);
            data.append('ifmanaged', this.state.proUpdateIfManaged);
            data.append('token', this.props.authentication[0].token);

        fetch(config.site_url + '/api/product/update', {
            method: 'POST',
            body: data,
        }).then(res => res.json())
            .then(json => {
                if(json.success) {
                    console.log("Successfull Product Update.");
                    this.props.updateProduct({
                        id: json.id,
                        menu: json.menu,
                        name: json.name,
                        sku: json.sku,
                        price: json.price,
                        stock: json.stock,
                        ifmanaged: json.ifmanaged,
                        description: json.description,
                        image: json.image
                    });
                    let imagename = obj.image.split(".");
                    this.setState({
                        proUpdateError: json.message,
                        proUpdateMenu: json.menu,
                        proUpdateName: json.name,
                        proUpdateSku: json.sku,
                        proUpdatePrice: json.price,
                        proUpdateStock: json.stock,
                        proUpdateIfManaged: json.ifmanaged,
                        proUpdateDescription: json.description,
                        updateInput: '',
                        fileName: imagename[0]
                    });
                } else {
                    this.setState({
                        proUpdateError: json.message
                    });
                }
            });
    }

    submitWithImage() {
        let types = [ 'image/jpeg', 'image/jpg', 'image/gif', 'image/png' ];
        if(types.includes(this.state.updateInput.files[0].type)) {
            if(this.state.updateInput.files[0].size < 249856) {
                if(this.state.updateInput.files[0].size > 0) {
                    this.submitUpdate();
                } else this.setState({ proUpdateError: 'File is less than 0 bytes.' });
            } else this.setState({ proUpdateError: 'File is bigger than 244 KB.' });
        } else this.setState({ proUpdateError: 'Invalid image type. Jpeg, jpg, gif or pngs allowed.' });
    }

	onSubmit(e) {
        e.preventDefault();
        if(this.state.updateInput.files[0]) this.submitWithImage();
        else this.submitUpdate();
	}

    render() {
        return (
                <div className="row margin-top-20px margin-bottom-50px">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        <h3>Product Update</h3>
                        {
                            (this.state.proUpdateError) ? (
                                <label>{this.state.proUpdateError}</label>
                            ) : (null)
                        }
                        <form name="proUpdate" onSubmit={this.onSubmit}>
                            <fieldset className="form-group">
                                <input ref={(ref) => { this.state.updateInput = ref; }} type="file" className="form-control-file btn btn-army"/>
                            </fieldset>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                                <fieldset className="form-group">
                                    <input value={this.state.fileName} onChange={this.onChange} name="fileName" type="text" className="form-element" placeholder="desired-name-of-file" />
                                </fieldset>
                                <div className="form-group">
                                    <select value={this.state.proUpdateMenu} onChange={this.onChange} name="proUpdateMenu" className="form-element custom">
                                        <option value="">Please select a value.</option>
                                        {
                                            this.state.links.map(link =>
                                                <option key={link.id} value={link.name}>{link.name}</option>
                                            )
                                        }
                                    </select>
                                </div>
                                <fieldset className="form-group">
                                    <input value={this.state.proUpdateName} onChange={this.onChange} name="proUpdateName" type="text" className="form-element" placeholder="Name"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input value={this.state.proUpdateSku} onChange={this.onChange} name="proUpdateSku" type="text" className="form-element" placeholder="Sku"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input value={this.state.proUpdatePrice} onChange={this.onChange} name="proUpdatePrice" type="text" className="form-element" placeholder="0.00"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input value={this.state.proUpdateStock} onChange={this.onChange} name="proUpdateStock" type="text" className="form-element" placeholder="Number in Stock"/>
                                </fieldset>
                                <div className="form-group">
                                    <select value={this.state.proUpdateIfManaged} onChange={this.onChange} name="proUpdateIfManaged" className="form-element custom">
                                        <option value="">Please select a value.</option>
                                        <option value="0">Always In Stock</option>
                                        <option value="1">Managed Stock</option>
                                    </select>
                                </div>
                                <fieldset className="form-group">
                                    <textarea value={this.state.proUpdateDescription} onChange={this.onChange} name="proUpdateDescription" className="form-element" rows="3" placeholder="Description"/>
                                </fieldset>
                            </div>
                            <button type="submit" className="btn btn-army">Product Update</button>
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

export default connect(mapStateToProps)(UpdateProducts);