import React from 'react';
import { connect } from 'react-redux';
import Navigation from '../../navigation';
import Footer from '../../footer';
import UploadProducts from '../products/upload-products';
import UpdateProducts from '../products/update-products';

class Products extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            path: '/products',
            authenticated: this.props.authentication[0].authenticated
        }
    }

    componentDidMount() {
        console.log(this.state);
        this.props.updatePath({ path: this.state.path });
    }

    render() {
        const { path, authenticated } = this.state;
        return (
            <div>
                <Navigation path={path} authenticated={authenticated}/>
                <div className="container">
                    <div className="row space-top-20px space-bottom-50px">
                        <h1>Product Upload Page</h1>
                        <div className="col-lg-4 col-md-4 col-sm-12 col xs-24">
                            <UploadProducts />
                        </div>
                        <div className="col-lg-8 col-md-8 col-sm-12 col xs-24">
                            <UpdateProducts />
                        </div>
                    </div>
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

function mapDispatchToProps(dispatch) {
    return {
        updatePath: (value) => {
            dispatch( { type: 'UPDATE_PATH', payload: value} )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Products)