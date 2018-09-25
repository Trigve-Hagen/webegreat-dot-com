import React from 'react';
import { connect } from 'react-redux';
import config from '../../../../../config/config';

class StoreVisibility extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visibilityError: '',
            visibility: '',
            selectedId: this.props.visibility[0].visibility
        }
        this.onChange = this.dropdownChanged.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    dropdownChanged(e){
        this.setState({ selectedId: e.target.value });
    }

	onSubmit(e) {
        e.preventDefault();

        const data = new FormData();
            data.append('visibility', this.state.visibility.value);
            data.append('token', this.props.authentication[0].token);

		fetch(config.site_url + '/api/profile/update-visibility', {
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
                                <select ref={ (ref) => { this.state.visibility = ref; }} value={this.selectedId} onChange={this.dropdownChanged.bind(this)} className="form-element">
                                    <option value="0">Store is not visiblity in front.</option>
                                    <option value="1">Store is visible in front.</option>
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