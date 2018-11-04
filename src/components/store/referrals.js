import React from 'react';
import config from '../../config/config';
import { convertTime } from '../utils/helpers';
import Pagination from '../pagination';

class Referrals extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            perPage: 15,
            currentPage: 1,
            loadReferralsError: '',
            referrals: []
        }
    }

    componentDidMount() {
		fetch(config.site_url + '/api/orders/referrals', {
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
                        let referrals = value['customer_survey'].split("_");
                        let items = value['items'].split("&"); let products = '';
                        for(let i=0; i<items.length; i++) {
                            let product = items[i].split("_");
                            if(i == items.length - 1) products += product[1];
                            else products += product[1] + " & ";
                        }
                        if(referrals[0] == 1) {
                            arrayArgs.push({
                                name: value['name'],
                                date: value['created_at'],
                                products: products,
                                stars: referrals[1],
                                comment: referrals[2]
                            });
                        }
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

    createStars(stars) {
        let starString = '';
        for(let j=0; j<stars; j++) {
            starString += '<i class="fa fa-star fa-2x font-awesome-star"></i>'
        }
        return {__html: starString};
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
                                <p>On {convertTime(referral.date)} {referral.name} ordered {referral.products} and gave WeBeGreat.com</p>
                                    <div dangerouslySetInnerHTML={this.createStars(referral.stars)} />
                                    <p>"{referral.comment}"</p>
                                </div>
                            )
                        }
                    </div>       
                </div>
            );
        } else return (<div><h4>There are no referrals yet</h4></div>);
    }
}

export default Referrals;