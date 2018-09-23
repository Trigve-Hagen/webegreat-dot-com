import React from 'react';
import { connect } from 'react-redux';

class StoreVisibility extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visibilityError: '',
            visibility: '',
        }
        this.onSubmit = this.onSubmit.bind(this);
    }

	onSubmit(e) {
        e.preventDefault();

        const data = new FormData();
            data.append('visibility', this.state.visibility.value);
            data.append('token', this.props.authentication[0].token);

		fetch('http://localhost:4000/api/profile/update-visibility', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    console.log("Visibility update successfull.");
                    this.props.updateVisibility({ visibility: json.visibility });
					this.setState({
                        visibilityError: json.message,
                        visibility: json.visibility
                    });
				} else {
                    this.setState({
						visibilityError: json.message
					});
                }
			});
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        <h3>Store Visibility</h3>
                        {
                            (this.state.visibilityError) ? (
                                <label>{this.state.visibilityError}</label>
                            ) : (null)
                        }
                        <form className="storeVisibility" onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <select ref={ (ref) => { this.state.visibility = ref; }} className="form-element" id="storVisibility">
                                    <option value="0" selected={ this.props.visibility[0].visibility ? 'selected' : '' }>Store is not visiblity in front.</option>
                                    <option value="1" selected={ this.props.visibility[0].visibility ? 'selected' : '' }>Store is visible in front.</option>
                                </select>
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
        visibility: state.visibility,
        authentication: state.authentication
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateVisibility: (value) => {
            dispatch( { type: 'UPDATE_VISIBILITY', payload: value} )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreVisibility);