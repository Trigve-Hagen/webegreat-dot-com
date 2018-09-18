import React from 'react';

class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newsletterError: '',
            newsletterName: '',
            newsletterEmail: '',
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
		this.setState({ [e.target.name]: e.target.value});
	}

	onSubmit(e) {
        e.preventDefault();
        const {
            newsletterName,
            newsletterEmail
		} = this.state;

		fetch('http://localhost:4000/api/account/upload-image', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
                name: newsletterName,
                email: newsletterEmail
			})
		}).then(res => res.json())
			.then(json => {
				/*if(json.success) {
                    console.log("Successfull SignIn." + json.token);
					this.props.updateAuth({ authenticated: true, token: json.token });
					this.setState({
                        loginError: json.message,
                        loginRedirect: true
					});
                    
				} else {
                    this.setState({
						loginError: json.message
					});
                }*/
			});
    }

    render() {
        const { newsletterError, newsletterEmail, newsletterName } = this.state;
        return (
            <div className="navbar navbar-inverse navbar-static-bottom rounded-0">
                <div className="container">
                    <div className="row space-top-20px">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                            <p className="navbar-text pull-left">© 2018 - Site Built By Trigve Hagen -
                                <a href="http://tinyurl.com/tbvalid" target="_blank" > HTML 5 Validation</a>
                            </p>

                            <a href="http://globalwebmethods.com" className="navbar-btn btn-primary btn pull-right">
                            <span className="glyphicon glyphicon-star"></span>  Global Web Methods</a>
                        </div>
                    </div>
                    <div className="row space-top-20px space-bottom-50px">
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-24">

                            <p className="footer-para-text space-bottom-20px">Trigve Hagen (209) 452-2699</p>
                            <ul className="footer-list-text">
                                <li className="footer-list-text"><a href="http://www.globalwebmethods.com" target="_blank" className="footer-link-text">Symfony - globalwebmethods.com</a></li>
                                <li className="footer-list-text"><a href="http://arcsvcs.com" target="_blank" className="footer-link-text">Laravel - arcsvcs.com</a></li>
                                <li className="footer-list-text"><a href="http://docrx.online" target="_blank" className="footer-link-text">Magento 2 - docrx.online</a></li>
                                <li className="footer-list-text"><a href="https://webegreat.com" target="_blank" className="footer-link-text">React - webegreat.com</a></li>
                                <li className="footer-list-text"><a href="https://bestspot2shop.com" target="_blank" className="footer-link-text">Custom Php - besspot2shop.com</a></li>
                                <li className="footer-list-text"><a href="https://github.com/Trigve-Hagen/webegreat-dot-com" target="_blank" className="footer-link-text">Github Repo - webegreat.com</a></li>
                                <li className="footer-list-text"><a href="https://github.com/Trigve-Hagen" target="_blank" className="footer-link-text">GitHub</a></li>
                            </ul>
                            

                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-24">
                            <h2>Newsletter</h2>
                            <form name="newsletter" onSubmit={this.onSubmit}>
                                {
                                    (newsletterError) ? (
                                        <label>{newsletterError}</label>
                                    ) : (null)
                                }
                                <fieldset className="form-group">
                                    <input type="text" value={newsletterName} onChange={this.onChange} name="newsletterName" className="form-element" placeholder="Name"/>
                                </fieldset>
                                <fieldset className="form-group">
                                    <input type="email" value={newsletterEmail} onChange={this.onChange} name="newsletterEmail" className="form-element" placeholder="Email"/>
                                </fieldset>
                                <button type="submit" className="btn btn-army" >Subscribe</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Footer;