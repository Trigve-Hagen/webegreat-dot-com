import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Navigation from '../../navigation';
import Footer from '../../footer';
import UploadProducts from '../products/upload-products';
import UpdateProducts from '../products/update-products';
import EditItem from './edit-item';
import ProductList from './product-list';

class Products extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(this.props.authentication[0].authenticated) {
            return (
                <div>
                    <Navigation path="/products" authenticated={this.props.authentication[0].authenticated}/>
                    <div className="container">
                        <div className="row space-top-20px space-bottom-50px">
                            <h1>Product Upload Page</h1>
                            <div className="col-lg-4 col-md-4 col-sm-12 col xs-24">
                                <ProductList />
                                <UploadProducts />
                            </div>
                            <div className="col-lg-8 col-md-8 col-sm-12 col xs-24">
                                <EditItem />
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
        authentication: state.authentication
    }
}

export default connect(mapStateToProps)(Products)