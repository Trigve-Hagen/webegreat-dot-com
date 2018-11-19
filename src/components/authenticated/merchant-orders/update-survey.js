import React from 'react';
import { connect } from 'react-redux';
import config from '../../../config/config';
import { convertTime } from '../../../components/utils/helpers';

class UpdateSurvey extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
            mordersUpdateSurvey: [],
            mordersUpdateSurveyError: '',
            mordersUpdateSurveyIfFront: ''
		}
        this.onChange= this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillReceiveProps(newProps) {
       this.getSurvey(newProps.orderId);
    }

    getSurvey = (orderId) => {
        fetch(config.site_url + '/api/survey/item', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				itemId: orderId,
                token: this.props.authentication[0].token
			})
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    let arrayArgs = [];
                    for (let value of Object.values(json.survey)) {
                        let range = [];
                        for(let i = 1; i <= value['stars']; i++) range.push(i);
                        arrayArgs.push({
                            id: value['surveyid'],
                            date: convertTime(value['created_at']),
                            iffront: value['iffront'],
                            stars: range,
                            comment: value['comment']
                        });
                        //count++;
                    }
                    console.log(arrayArgs)
					this.setState({
                        mordersUpdateSurveyError: json.message,
                        mordersUpdateSurvey: arrayArgs
					});
				} else {
                    this.setState({
						mordersUpdateSurveyError: json.message
					});
                }
			});
    }

    /*componentDidUpdate(prevProps, prevState) {
        if(prevProps.mordersUpdateSurveyIfFront !== this.state.mordersUpdateSurveyIfFront) {
            this.setState({
                mordersUpdateSurveyIfFront: this.state.mordersUpdateSurveyIfFront,
            });
        }
    }*/
    
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

	onSubmit(e) {
        e.preventDefault();
        const data = new FormData();
            data.append('id', this.props.item);
            data.append('iffront', this.state.mordersUpdateSurveyIfFront);
            data.append('token', this.props.authentication[0].token);

		fetch(config.site_url + '/api/morders/updateSurvey', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    console.log("User survey successfull." + json.iffront);
					this.setState({
                        mordersUpdateSurveyError: json.message,
                        mordersUpdateSurveyIfFront: json.iffront
                    });
                    //location.reload();
				} else {
                    this.setState({
						mordersUpdateSurveyError: json.message
					});
                }
			});
    }

    render() {
        if(this.state.mordersUpdateSurvey.comment) {
            return (
                <div>
                    {
                        this.state.mordersUpdateSurvey.map(item => {
                            <div className="mt-3" key={item.id}>
                                    <div className="row">
                                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                            {
                                                item.stars.map((element, index) => 
                                                    <img
                                                        src="/img/greenstar-md.png"
                                                        key={index}
                                                        style={{ maxWidth: '50px' }}
                                                        className="img-fluid"
                                                    />
                                                )
                                            }
                                            <p className="mb-1">{item.comment}</p>
                                            <p>
                                                {
                                                    item.iffront == 1
                                                        ? 'Showing in referrals'
                                                        : 'Not Showing in referrals'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <h4>Set if showing in referals.</h4>
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
                            }
                        )
                    }
                </div>
            )
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