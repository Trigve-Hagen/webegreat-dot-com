import React from 'react';
import { connect } from 'react-redux';
import Navigation from '../navigation';
import Footer from '../footer';

class About extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Navigation
                    path="/about"
                    authenticated={this.props.authentication[0].authenticated}
                    role={this.props.authentication[0].role}
                />
                <div className="container">
                    <div className="row space-top-20px space-bottom-50px">
                        <div className="col-lg-12 col-md-12 col-sm-12 col xs-24">
                            <h1>About Page</h1>
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

export default connect(mapStateToProps)(About)