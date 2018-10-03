import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import config from '../../../config/config';

class Logout extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.updateAuth({ authenticated: false, token: null, role: null });
        fetch(config.site_url + '/api/account/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				token: this.props.authentication[0].token
			})
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
					console.log("Successfull Logout.");
				} else {
                    this.setState({
						registerError: json.message
					});
                }
			});
        
    }

    render() {
        return <Redirect to='/' />;
    }
}

function mapStateToProps(state) {
    return {
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