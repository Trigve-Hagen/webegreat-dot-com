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

    /*componentDidUpdate(nextProps) {
        if(nextProps.order[0].surveyitems !== this.props.order[0].surveyitems) {
            this.setState({
                cordersSurveyUploadStars: this.props.order[0].surveyitems[0].stars,
                cordersSurveyUploadComment: this.props.order[0].surveyitems[0].comment
            });
        }
    }*/
    
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

	onSubmit(e) {
        e.preventDefault();
        
        const data = new FormData();
            data.append('id', this.props.orderId);
            data.append('iffront', 0);
            data.append('stars', this.state.cordersSurveyUploadStars);
            data.append('comment', this.state.cordersSurveyUploadComment);
            data.append('token', this.props.authentication[0].token);

		fetch(config.site_url + '/api/corders/survey', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
					console.log("User survey successfull.");
					this.setState({
                        cordersSurveyUploadError: json.message,
                        cordersSurveyUploadStars: json.stars,
                        cordersSurveyUploadComment: json.comment
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
        return (
            <div className="row mt-3">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <h4>Please tell us about you experience.</h4>
                    {
                        (this.state.cordersSurveyUploadError) ? (
                            <label>{this.state.cordersSurveyUploadError}</label>
                        ) : (null)
                    }
                    <form name="cSurveyUpload" onSubmit={this.onSubmit}>
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
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
        )
    }
}

function mapStateToProps(state) {
    return {
        authentication: state.authentication
    }
}

export default connect(mapStateToProps)(UploadSurvey);