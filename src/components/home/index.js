import React from 'react';
import { connect } from 'react-redux';
import ProductListing from '../product-listing';
import products from '../../data/products';
import Navigation from '../navigation';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            path: '/',
            authenticated: this.props.authentication[0].authenticated
        }
    }

    componentDidMount() {
        console.log(this.state);
    }

    render() {
        const { path, authenticated } = this.state;
        return (
            <div>
                <Navigation path={path} authenticated={authenticated}/>
                <div className="container">
                    <ProductListing products={products}/>
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

export default connect(mapStateToProps)(Home)