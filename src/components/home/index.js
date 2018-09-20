import React from 'react';
import { connect } from 'react-redux';
import ProductListing from '../product-listing';
import products from '../../data/products';
import Navigation from '../navigation';
import Footer from '../footer';

class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Navigation path="/" authenticated={this.props.authentication[0].authenticated}/>
                <div className="container">
                    <ProductListing products={products}/>
                </div>
                <Footer />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        authentication: state.authentication
    }
}

export default connect(mapStateToProps)(Home)