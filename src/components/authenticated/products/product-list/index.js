import React from 'react';
import { connect } from 'react-redux';
import Pagination from '../../../product-components/pagination';

class ProductList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 15,
            loadProductError: '',
            products: []
        }
        this.onView = this.onView.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    componentDidMount() {
		fetch('http://localhost:4000/api/product/front', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				currentPage: this.props.pagination[0].currentPage,
                perPage: this.state.perPage,
			})
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    let arrayArgs = [];
                    for (let value of Object.values(json.products)) {
                        arrayArgs.push({
                            id: value['productid'],
                            image: value['image'],
                            name: value['name'],
                            price: value['price'],
                            description: value['description']
                        });
                    }
                    //console.log(arrayArgs);
					this.setState({
                        loadProductError: json.message,
                        products: arrayArgs
					});
				} else {
                    this.setState({
						loadProductError: json.message
					});
                }
			});
    }

    onView(productid) {
        console.log(productid);
    }

    onDelete(productid) {
        console.log(productid);
    }

    render() {
        //this.props.resetProduct();
        //console.log(this.state.products);
        return (
            <div>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        <Pagination />
                        <ul className="pagination">
                            {
                                this.state.products.map(product => {
                                    <li>
                                        {product.name} 
                                        <a onClick={this.onView(product.id)}>View</a> 
                                        <a onClick={this.onDelete(product.id)}>Delete</a>
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        pagination: state.pagination
    }
}

export default connect(mapStateToProps)(ProductList);