import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Navigation from '../navigation';
import Footer from '../footer';
import config from '../../config/config';

class Signup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
			loginEmail: '',
            loginError: '',
            loginRedirect: false
		}
    }

	componentDidMount() {
        const {
			loginEmail,
		} = this.state;

		fetch(config.site_url + '/api/account/signup-complete', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: loginEmail
			})
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
					this.setState({
                        loginError: json.message,
                        loginRedirect: true
					});
				} else {
                    this.setState({
						loginError: json.message
					});
                }
			});
    }

    render() {
        if(this.state.loginRedirect) return <Redirect to='/login' />;
        return (
            <div>
                <Navigation path="/signup" authenticated={this.props.authentication[0].authenticated}/>
                <div className="container">
                    <div className="row space-top-20px space-bottom-50px">
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
							<h3>Something went wrong. Please try again later.</h3>
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

function mapDispatchToProps(dispatch) {
    return {
        updateAuth: (value) => {
            dispatch( { type: 'UPDATE_AUTH', payload: value} )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);