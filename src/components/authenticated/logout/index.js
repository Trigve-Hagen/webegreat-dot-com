import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

class Logout extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.updateAuth({ authenticated: false, token: null });
    }

    render() {
        return <Redirect to='/' />;
    }
}

function mapStateToProps(state) {
    return {
        navigation: state.navigation,
        authentication: state.authentication
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateAuth: (value) => {
            dispatch( { type: 'UPDATE_AUTH', payload: value} )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout)