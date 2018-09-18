import React from 'react';
import { connect } from 'react-redux';

class ToggleOnStore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            onError: '',
            onSelect: '',
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
		this.setState({ [e.target.name]: e.target.value});
	}

	onSubmit(e) {
        e.preventDefault();
        const {
			onSelect
		} = this.state;

		fetch('http://localhost:4000/api/account/upload-image', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				select: onSelect
			})
		}).then(res => res.json())
			.then(json => {
				/*if(json.success) {
                    console.log("Successfull SignIn." + json.token);
					this.props.updateAuth({ authenticated: true, token: json.token });
					this.setState({
                        loginError: json.message,
                        loginRedirect: true
					});
                    
				} else {
                    this.setState({
						loginError: json.message
					});
                }*/
			});
    }

    render() {
        const { onError, onSelect } = this.state;
        return (
            <div>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        <h3>Check Paypal</h3>
                        {
                            (onError) ? (
                                <label>{onError}</label>
                            ) : (null)
                        }
                        <form className="checkPaypal" onSubmit={this.onSubmit}>
                            <button type="submit" className="btn btn-army">Run $1.00 Charge</button>
                        </form>
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

export default connect(mapStateToProps)(ToggleOnStore)