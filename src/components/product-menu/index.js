import React from 'react';
import { connect } from 'react-redux';

class ProductMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        //console.log(this.props.frontMenu);
        return (
            <div className="row space-top-20px space-bottom-50px">
                <div className="col-lg-12 col-md-12 col-sm-12 col xs-24">
                    <h3>Product Menu</h3>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        frontMenu: state.frontMenu,
        authentication: state.authentication
    }
}

export default connect(mapStateToProps)(ProductMenu)