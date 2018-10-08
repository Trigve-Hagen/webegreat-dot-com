import React from 'react';
import { connect } from 'react-redux';
import Navigation from './components/navigation';
import Footer from './components/footer';

class NotFound extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Navigation
                    path="/notfound"
                    authenticated={this.props.authentication[0].authenticated}
                    role={this.props.authentication[0].role}
                />
                <div className="container">
                    <div className="row space-top-20px space-bottom-50px">
                        <div className="col-lg-12 col-md-12 col-sm-12 col xs-24">
                            <h1>Page not found.</h1>
                            <p>Please try another page.</p>
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

export default connect(mapStateToProps)(NotFound)
