import React from 'react';
import config from '../../config/config';
import { convertTime } from '../utils/helpers';
import Pagination from '../pagination';

class Referrals extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: config.per_page,
            currentPage: 1,
            loadReferralsError: '',
            referrals: []
        }
    }

    componentDidMount() {
		fetch(config.site_url + '/api/store/referrals', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				currentPage: this.state.currentPage,
                perPage: this.state.perPage
			})
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    let arrayArgs = [];
                    for (let value of Object.values(json.orders)) {
                        let range = [];
                        for(let i = 1; i <= value['stars']; i++) range.push(i);
                        arrayArgs.push({
                            name: value['name'],
                            stars: range,
                            comment: value['comment']
                        });
                    }
                    //console.log(arrayArgs);
					this.setState({
                        referrals: arrayArgs
					});
				} else {
                    this.setState({
						loadReferralsError: json.message
					});
                }
			});
    }

    render() {
        if(this.state.referrals.length > 0) {
            return (
                <div className="row my-1">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 text-center">
                        {
                            (this.state.loadReferralsError) ? (
                                <label>{this.state.loadReferralsError}</label>
                            ) : (null)
                        }
                        {
                            this.state.referrals.map((referral, index) =>
                                <div className="referrals" key={index}>
                                <p className="mb-1">{referral.date} {referral.name} gave WeBeGreat.com</p>
                                    {
                                        referral.stars.map((element, index) => 
                                            <img
                                                src="/img/greenstar-md.png"
                                                key={index}
                                                style={{ maxWidth: '50px' }}
                                                className="img-fluid"
                                            />
                                        )
                                    }
                                    <p>"{referral.comment}"</p>
                                </div>
                            )
                        }
                    </div>       
                </div>
            );
        } else return <div></div>;
    }
}

export default Referrals;