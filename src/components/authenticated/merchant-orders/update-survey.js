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

    render() {
        if(this.props.orders[0].surveyitems[0].comment) {
            let starString = ''; let ifShowing = '';
            if(this.props.orders[0].surveyitems[0].iffront == 0) ifShowing = "Not Showing in referrals";
            if(this.props.orders[0].surveyitems[0].iffront == 1) ifShowing = "Showing in referrals";
            if(this.props.orders[0].surveyitems[0].stars == 1) starString = <div><span className="glyphicon glyphicon-star" /></div>;
            else if(this.props.orders[0].surveyitems[0].stars == 2) starString = <div><span className="glyphicon glyphicon-star" /><span className="glyphicon glyphicon-star" /></div>;
            else if(this.props.orders[0].surveyitems[0].stars == 3) starString = <div><span className="glyphicon glyphicon-star" /><span className="glyphicon glyphicon-star" /><span className="glyphicon glyphicon-star" /></div>;
            else if(this.props.orders[0].surveyitems[0].stars == 4) starString = <div><span className="glyphicon glyphicon-star" /><span className="glyphicon glyphicon-star" /><span className="glyphicon glyphicon-star" /><span className="glyphicon glyphicon-star" /></div>;
            else if(this.props.orders[0].surveyitems[0].stars == 5) starString = <div><span className="glyphicon glyphicon-star" /><span className="glyphicon glyphicon-star" /><span className="glyphicon glyphicon-star" /><span className="glyphicon glyphicon-star" /><span className="glyphicon glyphicon-star" /></div>;
            return (
                <div className="margin-top-50px">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                            {starString}
                            <p className="margin-top-bottom-zero">{this.props.orders[0].surveyitems[0].comment}</p>
                            <p className="margin-top-bottom-zero">{ifShowing}</p>
                        </div>
                    </div>
                    <h4>Set if showing in referals.</h4>
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                            {
                                (this.state.mordersSurveyUpdateError) ? (
                                    <label>{this.state.mordersSurveyUpdateError}</label>
                                ) : (null)
                            }
                            <form name="cSurveyUpload" onSubmit={this.onSubmit}>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
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