import React from 'react';

export default function UpdateSurvey(props) {
    return <div className="mt-3">
            <div className="row">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    {
                        props.stars.map((element, index) => 
                            <img
                                src="/img/greenstar-md.png"
                                key={index}
                                style={{ maxWidth: '50px' }}
                                className="img-fluid"
                            />
                        )
                    }
                    <p className="mb-1">{props.comment}</p>
                    <p>
                        {
                            props.iffront == 1
                                ? 'Showing in referrals'
                                : 'Not Showing in referrals'
                        }
                    </p>
                </div>
            </div>
            <h4>Set if showing in referals.</h4>
            {
                (props.error) ? (
                    <label>{props.error}</label>
                ) : (null)
            }
            <div className="row">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    
                    <form name="cSurveyUpload" onSubmit={props.onSurveySubmit}>
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            <div className="form-group">
                                <select
                                    value={props.iffront}
                                    onChange={props.onSurveyChange}
                                    name="updateSurveyIfFront"
                                    className="form-element custom"
                                >
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