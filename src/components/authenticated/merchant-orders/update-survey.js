import React from 'react';
import { connect } from 'react-redux';
import config from '../../../config/config';

class UpdateSurvey extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
            mordersSurveyUpdateError: '',
            mordersSurveyUpdateIfFront: this.props.orders[0].surveyitems[0].iffront,
		}
        this.onChange= this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidUpdate(nextProps) {
        if(nextProps.orders[0].surveyitems !== this.props.orders[0].surveyitems) {
            this.setState({
                mordersSurveyUpdateIfFront: this.props.orders[0].surveyitems[0].iffront
            });
        }
    }
    
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

	onSubmit(e) {
        e.preventDefault();
        
        const data = new FormData();
            data.append('id', this.props.orders[0].id);
            data.append('iffront', this.state.mordersSurveyUpdateIfFront);
            data.append('stars', this.props.orders[0].surveyitems[0].stars);
            data.append('comment', this.props.orders[0].surveyitems[0].comment);
            data.append('token', this.props.authentication[0].token);

		fetch(config.site_url + '/api/corders/survey', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
					console.log("User survey successfull.");
					this.setState({
                        mordersSurveyUpdateError: json.message,
                        mordersSurveyUpdateIfFront: json.iffront
                    });
                    //location.reload();
				} else {
                    this.setState({
						mordersSurveyUpdateError: json.message
					});
                }
			});
    }
    
    createMarkup() {
        return {__html: this.props.post};
    }

    render() {
        if(this.props.orders[0].surveyitems[0].comment) {
            let starString = '';
            for(let j=0; j<this.props.orders[0].surveyitems[0].stars; j++) {
                starString += '<img src="/img/greenstar-md.png" style="max-width:50px" className="img-fluid"/>'
            }
            return (
                <div className="mt-3">
                    <div className="row">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            <div dangerouslySetInnerHTML={{__html: starString}} />
                            <p className="mb-1">{this.props.orders[0].surveyitems[0].comment}</p>
                            <p>
                                {
                                    this.props.orders[0].surveyitems[0].iffront
                                        ? 'Showing in referrals'
                                        : 'Not Showing in referrals'
                                }
                            </p>
                        </div>
                    </div>
                    <h4>Set if showing in referals.</h4>
                    <div className="row">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            {
                                (this.state.mordersSurveyUpdateError) ? (
                                    <label>{this.state.mordersSurveyUpdateError}</label>
                                ) : (null)
                            }
                            <form name="cSurveyUpload" onSubmit={this.onSubmit}>
                                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                    <div className="form-group">
                                        <select value={this.state.mordersSurveyUpdateIfFront} onChange={this.onChange} name="mordersSurveyUpdateIfFront" className="form-element custom">
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
            );
        } else return (<div></div>);
    }
}

function mapStateToProps(state) {
    return {
        role: state.role,
        morders: state.morders,
        authentication: state.authentication
    }
}

export default connect(mapStateToProps)(UpdateSurvey);