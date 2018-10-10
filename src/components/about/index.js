import React from 'react';
import { connect } from 'react-redux';
import Navigation from '../navigation';
import Footer from '../footer';

class About extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Navigation
                    path="/about"
                    authenticated={this.props.authentication[0].authenticated}
                    role={this.props.authentication[0].role}
                />
                <div className="container">
                    <div className="row space-top-20px space-bottom-50px">
                        <div className="col-lg-12 col-md-12 col-sm-12 col xs-24">
                            <h1>About Page</h1>
                            <p>Federal tax brackets: 2018 tax brackets (for taxes due April 15, 2019)</p>
                            <p>If tax percents goes up with earned income that means that the government pulls in more income as people make more money. It makes sense to pay the people as much as possible to bring in more income. What if there was an insentive program built by the government to pay the service workers(hired by the government) more as the wealth of the common citizen grows bases upon the tax percent brackets. As the service workers find ways to get common citizens to make more their salaries rise right along side of them. City by City so we can prosper more if we work harder for our people. The biggest jump for income pulled in in taxes is at the 20 dollars an hour mark. This should be the goal for getting people paid. This and above. Maybe a tax cut for the rich to get them to pay us more. I need the number of people in the city working for under 20 an hour and the number of civil servive workers working to calculate the raise in income it could generate.</p>
                            <div className="row space-top-20px space-bottom-50px">
                                <div className="col-lg-12 col-md-12 col-sm-12 col xs-24">
                                    <table className="table">
                                        <thead>
                                            <tr><th>Hour</th>
                                            <th>Yearly</th>
                                            <th>Single Rate</th>
                                            <th>Pays</th>
                                            <th>Take Home</th></tr>
                                        </thead>
                                        <tbody>
                                            <tr><td>$11</td><td>$22,880</td><td>15%</td><td>$3,432</td><td>$19,448</td></tr>
                                            <tr><td>$15</td><td>$31,200</td><td>15%</td><td>$4,680</td><td>$26,520</td></tr>
                                            <tr><td>$18</td><td>$37,440</td><td>15%</td><td>$5,616 --</td><td>$31,824</td></tr>
                                            <tr><td>$20</td><td>$41,600</td><td>25%</td><td>$10,400 --</td><td>$31,200</td></tr>
                                            <tr><td>$25</td><td>$52,000</td><td>25%</td><td>$13,000</td><td>$39,000</td></tr>
                                            <tr><td>$30</td><td>$62,400</td><td>25%</td><td>$15,600</td><td>$47,400</td></tr>
                                            <tr><td>$50</td><td>$104,000</td><td>28%</td><td>$29,120</td><td>$74,880</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="row space-top-20px space-bottom-50px">
                                <div className="col-lg-6 col-md-6 col-sm-12 col xs-24">
                                    <table className="table">
                                        <thead>
                                            <tr><th>Rate</th>
                                            <th>Single</th>
                                            <th>Upper Taxes</th></tr>
                                        </thead>
                                        <tbody>
                                            <tr><td>10%</td><td>Up to $9,525</td><td>$953</td></tr>
                                            <tr><td>15%</td><td>$9,326 to $37,950</td><td>$5,693</td></tr>
                                            <tr><td>25%</td><td>$37,951 to $91,900</td><td>$22,975--</td></tr>
                                            <tr><td>28%</td><td>$91,901 to $191,650</td><td>$53,662--</td></tr>
                                            <tr><td>33%</td><td>$191,651 to $416,700</td><td>$137,511</td></tr>
                                            <tr><td>35%</td><td>$416,701 to $418,400</td><td>$146,440</td></tr>
                                            <tr><td>39.6%</td><td>$418,401 or more</td><td>$165,687</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 col col-xs-24">
                                    <table className="table">
                                        <thead>
                                            <tr><th>Rate</th>
                                            <th>Head of Household</th>
                                            <th>Upper Taxes</th></tr>
                                        </thead>
                                        <tbody>
                                            <tr><td>10%</td><td>Up to $13,600</td><td>$1,360</td></tr>
                                            <tr><td>15%</td><td>$13,351 to $50,800</td><td>$7,620</td></tr>
                                            <tr><td>25%</td><td>$50,801 to $131,200</td><td>$32,800--</td></tr>
                                            <tr><td>28%</td><td>$131,201 to $212,500</td><td>$59,500--</td></tr>
                                            <tr><td>33%</td><td>$212,501 to $416,700</td><td>$137,511</td></tr>
                                            <tr><td>35%</td><td>$416,701 to $444,550</td><td>$155,593</td></tr>
                                            <tr><td>39.6%</td><td>$444,551 or more</td><td>$176,043</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="row space-top-20px space-bottom-50px">
                                <div className="col-lg-6 col-md-6 col-sm-12 col xs-24">
                                    <table className="table">
                                        <thead>
                                            <tr><th>Rate</th>
                                            <th>Married filing jointly or qualifying widow</th>
                                            <th>Upper Taxes</th></tr>
                                        </thead>
                                        <tbody>
                                            <tr><td>10%</td><td>Up to $19,050</td><td>$1,905</td></tr>
                                            <tr><td>12%</td><td>$19,051 to $77,400</td><td>$9,288</td></tr>
                                            <tr><td>22%</td><td>$77,401 to $165,000</td><td>$36,300--</td></tr>
                                            <tr><td>24%</td><td>$165,001 to $315,000</td><td>$75,600--</td></tr>
                                            <tr><td>32%</td><td>$315,001 to $400,000</td><td>$128,000</td></tr>
                                            <tr><td>35%</td><td>$400,001 to $600,000</td><td>$210,000</td></tr>
                                            <tr><td>37%</td><td>$600,001 or more</td><td>$222,001</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 col col-xs-24">
                                    <table className="table">
                                        <thead>
                                            <tr><th>Rate</th>
                                            <th>Married filing separately</th>
                                            <th>Upper Taxes</th></tr>
                                        </thead>
                                        <tbody>
                                            <tr><td>10%</td><td>Up to $9,525</td><td>$953</td></tr>
                                            <tr><td>12%</td><td>$9,525 to $38,700</td><td>$4,644</td></tr>
                                            <tr><td>22%</td><td>$38,701 to $82,500</td><td>$18,150--</td></tr>
                                            <tr><td>24%</td><td>$82,501 to $157,000</td><td>$37,680--</td></tr>
                                            <tr><td>32%</td><td>$157,001 to $200,000</td><td>$64,000</td></tr>
                                            <tr><td>35%</td><td>$200,001 to $300,000</td><td>$105,000</td></tr>
                                            <tr><td>37%</td><td>$300,001 or more</td><td>$111,001</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        authentication: state.authentication
    }
}

export default connect(mapStateToProps)(About)