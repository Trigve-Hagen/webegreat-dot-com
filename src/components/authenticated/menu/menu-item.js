import React from 'react';
import { connect } from 'react-redux';

class MenuItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-24 text-center">
                    <h3>{this.props.menu[0].name}</h3>
                    <p>{this.props.menu[0].description}</p>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-24 text-center">
                    <h3>Level: {this.props.menu[0].level}</h3>
                    <p>Parent: {this.props.menu[0].parent}</p>
                    <p>If Product Link:
                        {
                            this.props.menu[0].ifproduct
                                ? ' Link to products'
                                : ' No link'
                        }
                    </p>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        menu: state.menu
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addToCart: (item) => {
            dispatch({ type: 'ADD', payload: item })
        },
        removeFromCart: (item) => {
            dispatch({ type: 'REMOVE', payload: item })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuItem)