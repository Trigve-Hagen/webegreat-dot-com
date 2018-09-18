import React from 'react';
import { connect } from 'react-redux';
import Navigation from '../navigation';

class Contact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            path: '/contact',
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
                    <h1>Contact Page</h1>
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

export default connect(mapStateToProps)(Contact)