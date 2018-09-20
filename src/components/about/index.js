import React from 'react';
import { connect } from 'react-redux';
import Navigation from '../navigation';
import Footer from '../footer';

class About extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            path: '/about',
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