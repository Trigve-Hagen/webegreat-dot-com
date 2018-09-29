import React from 'react';
import { connect } from 'react-redux';

class MenuDisplay extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="row space-top-20px space-bottom-50px">
                <div className="col-lg-12 col-md-12 col-sm-12 col xs-24">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col xs-24">
                            <h1 className="text-center">Menu Display</h1>
                        </div>
                    </div>
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

export default connect(mapStateToProps)(MenuDisplay)