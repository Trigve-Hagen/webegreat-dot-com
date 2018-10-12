import React from 'react';
import { connect } from 'react-redux';
import config from '../../../config/config';

class UploadSurvey extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
            cordersSurveyUploadError: '',
            cordersSurveyUploadStars: '',
            cordersSurveyUploadComment: ''
		}
        this.onChange= this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
    }
    
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

	onSubmit(e) {
        e.preventDefault();
        let surveyString = this.state.cordersSurveyUploadStars + "_" + this.state.cordersSurveyUploadComment;
        const data = new FormData();
            data.append('survey', surveyString);
            data.append('token', this.props.authentication[0].token);

		fetch(config.site_url + '/api/corders/survey', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
					console.log("User survey successfull.");
					/*this.props.updateCSurvey({
                        id: json.transid,
                        stars: json.stars,
                        comment: json.comment
                    });*/
					this.setState({
                        cordersSurveyUploadError: json.message,
                        cordersSurveyUploadStars: '',
                        cordersSurveyUploadComment: ''
                    });
                    //location.reload();
				} else {
                    this.setState({
						cordersSurveyUploadError: json.message
					});
                }
			});
	}

    render() {
        //this.props.resetCSurvey();
        return (
			<div>
                <h4>Please tell us about you experience.</h4>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        {
                            (this.state.cordersSurveyUploadError) ? (
                                <label>{this.state.cordersSurveyUploadError}</label>
                            ) : (null)
                        }
                        <form name="cSurveyUpload" onSubmit={this.onSubmit}>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                                <div className="form-group">
                                    <select value={this.state.cordersSurveyUploadStars} onChange={this.onChange} name="cordersSurveyUploadStars" className="form-element custom">
                                        <option value="">Please rate our service.</option>
                                        <option value="1">One Star</option>
                                        <option value="2">Two Star</option>
                                        <option value="3">Three Star</option>
                                        <option value="4">Four Star</option>
                                        <option value="5">Five Star</option>
                                    </select>
                                </div>
                                <fieldset className="form-group">
                                    <textarea value={this.state.cordersSurveyUploadComment} onChange={this.onChange} name="cordersSurveyUploadComment" className="form-element" rows="3" placeholder="Please leave a comment."/>
                                </fieldset>
                            </div>
                            <button type="submit" className="btn btn-army">Submit Survey</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        role: state.role,
        morders: state.morders,
        authentication: state.authentication
    }
}

/*function mapDispatchToProps(dispatch) {
    return {
        updateCSurvey: (value) => {
            dispatch({ type: 'UPDATE_CSURVEY', payload: value})
        },
        resetCSurvey: (value) => {
            dispatch({ type: 'RESET_CSURVEY', payload: value})
        }
    }
}*/

export default connect(mapStateToProps)(UploadSurvey);