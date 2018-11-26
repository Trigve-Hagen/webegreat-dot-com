import React from 'react';

export default function UploadSurvey(props) {
    return <div className="row mt-3">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                <h4>Please tell us about you experience.</h4>
                <form name="cSurveyUpload" onSubmit={props.onSubmitSurvey}>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="form-group">
                            <select
                                value={props.stars}
                                onChange={props.onChangeSurvey}
                                name="surveyStars"
                                className="form-element custom"
                            >
                                <option value="">Please rate our service.</option>
                                <option value="1">One Stars</option>
                                <option value="2">Two stars</option>
                                <option value="3">Three Stars</option>
                                <option value="4">Four Stars</option>
                                <option value="5">Five Stars</option>
                            </select>
                        </div>
                        <fieldset className="form-group">
                            <textarea
                                value={props.comment}
                                onChange={props.onChangeSurvey}
                                name="surveyComment"
                                className="form-element"
                                rows="3"
                                placeholder="Please leave a comment."
                            />
                        </fieldset>
                    </div>
                    <button type="submit" className="btn btn-army">Submit Survey</button>
                </form>
            </div>
        </div>
}