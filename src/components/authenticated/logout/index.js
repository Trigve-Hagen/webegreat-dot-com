import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

class Logout extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.updateAuth({ authenticated: false, token: null });
        fetch('http://localhost:4000/api/account/logout', {
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