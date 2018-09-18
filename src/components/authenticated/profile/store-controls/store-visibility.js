import React from 'react';
import { connect } from 'react-redux';

class StoreVisibility extends React.Component {
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
                        <h3>Store Visibility</h3>
                        {
                            (onError) ? (
                                <label>{onError}</label>
                            ) : (null)
                        }
                        <form className="storeVisibility" onSubmit={this.onSubmit}>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" value={onSelect} onChange={this.onChange} checked />
                                <label className="form-check-label" htmlFor="exampleRadios1">
                                    Store visible in front.
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" value={onSelect} onChange={this.onChange} />
                                <label className="form-check-label" htmlFor="exampleRadios2">
                                    Store not visible in front.
                                </label>
                            </div>
                            <button type="submit" className="btn btn-army">Update Visibility</button>
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

export default connect(mapStateToProps)(StoreVisibility)