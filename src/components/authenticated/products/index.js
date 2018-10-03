import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Navigation from '../../navigation';
import Footer from '../../footer';
import UploadProducts from '../products/upload-products';
import UpdateProducts from '../products/update-products';
import ProductItem from './product-item';
import ProductList from './product-list';

class Products extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(this.props.authentication[0].authenticated && this.props.authentication[0].role == 3) {
            return (
                <div>
                    <Navigation path="/products" authenticated={this.props.authentication[0].authenticated} role={this.props.authentication[0].role}/>
                    <div className="container">
                        <div className="row space-top-20px space-bottom-50px">
                            <h2>Create Product</h2>
                            <div className="col-lg-4 col-md-4 col-sm-12 col xs-24">
                                <ProductList />
                                <UploadProducts />
                            </div>
                            <div className="col-lg-8 col-md-8 col-sm-12 col xs-24">
                                <ProductItem product={this.props.product}/>
                                <UpdateProducts />
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            )
        } else return <Redirect to='/' />;
    }
}

function mapStateToProps(state) {
    return {
        product: state.product,
        authentication: state.authentication
    }
}

export default connect(mapStateToProps)(Products)