import React from 'react';
import { connect } from 'react-redux';
import config from '../../../config/config';
import { convertTime } from '../../../components/utils/helpers';

class UpdateSurvey extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
            mordersUpdateSurveyError: '',
            mordersUpdateSurveyIfFront: '',
            morderUpdateSurveyStars: [],
            morderUpdateSurveyComment: ''
		}
        this.onChange= this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillReceiveProps(newProps) {
       this.getSurvey(newProps.surveyId);
    }

    getSurvey = (surveyId) => {
        fetch(config.site_url + '/api/survey/item', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				itemId: surveyId,
                token: this.props.authentication[0].token
			})
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    let range = [];
                    for(let i = 1; i <= json.stars; i++) range.push(i);
					this.setState({
                        mordersUpdateSurveyError: json.message,
                        mordersUpdateSurveyIfFront: json.iffront,
                        morderUpdateSurveyStars: range,
                        morderUpdateSurveyComment: json.comment,
					});
				} else {
                    this.setState({
						mordersUpdateSurveyError: json.message
					});
                }
			});
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.mordersUpdateSurveyIfFront !== this.state.mordersUpdateSurveyIfFront) {
            this.setState({
                mordersUpdateSurveyIfFront: this.state.mordersUpdateSurveyIfFront,
            });
        }
    }
    
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

	onSubmit(e) {
        e.preventDefault();
        const data = new FormData();
            data.append('id', this.props.surveyId);
            data.append('iffront', this.state.mordersUpdateSurveyIfFront);
            data.append('token', this.props.authentication[0].token);

		fetch(config.site_url + '/api/morders/updateSurvey', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    let range = [];
                    for(let i = 1; i <= json.stars; i++) range.push(i);
					this.setState({
                        mordersUpdateSurveyError: json.message,
                        mordersUpdateSurveyIfFront: json.iffront,
                        morderUpdateSurveyStars: range,
                        morderUpdateSurveyComment: json.comment,
					});
				} else {
                    this.setState({
						mordersUpdateSurveyError: json.message
					});
                }
			});
    }

    render() {
        if(this.state.morderUpdateSurveyComment != '') {
            return <div className="mt-3">
                    <div className="row">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            {
                                this.state.morderUpdateSurveyStars.map((element, index) => 
                                    <img
                                        src="/img/greenstar-md.png"
                                        key={index}
                                        style={{ maxWidth: '50px' }}
                                        className="img-fluid"
                                    />
                                )
                            }
                            <p className="mb-1">{this.state.morderUpdateSurveyComment}</p>
                            <p>
                                {
                                    this.state.mordersUpdateSurveyIfFront == 1
                                        ? 'Showing in referrals'
                                        : 'Not Showing in referrals'
                                }
                            </p>
                        </div>
                    </div>
                    <h4>Set if showing in referals.</h4>
                    {
                        (this.state.mordersUpdateSurveyError) ? (
                            <label>{this.state.mordersUpdateSurveyError}</label>
                        ) : (null)
                    }
                    <div className="row">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            
                            <form name="cSurveyUpload" onSubmit={this.onSubmit}>
                                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                    <div className="form-group">
                                        <select value={this.state.mordersUpdateSurveyIfFront} onChange={this.onChange} name="mordersUpdateSurveyIfFront" className="form-element custom">
                                            <option value="">Please select a value.</option>
                                            <option value="0">Don't show in front.</option>
                                            <option value="1">Show in front.</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-army">Update Survey</button>
                            </form>
                        </div>
                    </div>
                </div>
        } else {
            return <div className="row mt-3">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <p>No referal yet.</p>
                    </div>
                </div>
        }
    }
}

function mapStateToProps(state) {
    return {
        authentication: state.authentication
    }
}

export default connect(mapStateToProps)(UpdateSurvey);