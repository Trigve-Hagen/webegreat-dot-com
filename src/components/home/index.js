import React from 'react';
import { connect } from 'react-redux';
import ProductListing from '../product-listing';
import products from '../../data/products';
import Navigation from '../navigation';
import Footer from '../footer';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            path: '/',
            authenticated: false
        }
    }

    componentWillReceiveProps() {
        if(this.props.authentication[0].authenticated != undefined) {
            this.setState({
                authenticated: this.props.authentication[0].authenticated 
            });
        }
    }

    render() {
        const { path, authenticated } = this.state;
        return (
            <div>
                <Navigation path={path} authenticated={authenticated}/>
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