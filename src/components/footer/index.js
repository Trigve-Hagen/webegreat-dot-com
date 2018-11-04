import React from 'react';
import config from '../../config/config';

const inputText = {
    color: '#9d9d9d'
}

class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newsletterError: '',
            newsletterName: '',
            newsletterEmail: '',
        }
        this.onSubmit = this.onSubmit.bind(this);
    }

	onSubmit(e) {
        e.preventDefault();

        const data = new FormData();
            data.append('name', this.state.newsletterName.value);
            data.append('email', this.state.newsletterEmail.value);

		fetch(config.site_url + '/api/newsletter/registration', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    console.log("Newsletter registration update successfull.");
					this.setState({
                        newsletterError: json.message,
                        newsletterName: json.name,
                        newsletterEmail: json.email
                    });
				} else {
                    this.setState({
						newsletterError: json.message
					});
                }
			});
    }

    render() {
        return (
            <div className="navbar navbar-dark bg-dark webegreat-footer">
                <div className="container mb-4">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                        <p className="footer-para-text mb-1">© 2018 - Site Built By Trigve Hagen</p>
                        <p className="footer-para-text mt-1 mb-3">Trigve Hagen (209)452-2699</p>
                        <p className="footer-para-text my-0">Laravel - <a
                                href="http://arcsvcs.com"
                                target="_blank"
                                className="footer-link-text"
                            >
                                arcsvcs.com
                            </a>
                        </p>
                        <p className="footer-para-text my-0">Magento 2 - <a
                                href="http://docrx.online"
                                target="_blank"
                                className="footer-link-text"
                            >
                                docrx.online
                            </a>
                        </p>
                        <p className="footer-para-text my-0">React - <a
                                href="https://webegreat.com"
                                target="_blank"
                                className="footer-link-text"
                            >
                                webegreat.com
                            </a>
                        </p>
                        <p className="footer-para-text my-0">Github - <a
                                href="https://github.com/Trigve-Hagen/webegreat-dot-com"
                                target="_blank"
                                className="footer-link-text"
                            >
                                webegreat-dot-com
                            </a>
                        </p>
                        <p className="footer-para-text my-0">Custom Php - <a
                                href="https://bestspot2shop.com"
                                target="_blank"
                                className="footer-link-text"
                            >
                                bestspot2shop.com
                            </a>
                        </p>
                        <p className="footer-para-text my-0">Symfony - <a
                                href="http://www.globalwebmethods.com"
                                target="_blank"
                                className="footer-link-text"
                            >
                                globalwebmethods.com
                            </a>
                        </p>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mt-3">
                        <h2 style={inputText}>Newsletter</h2>
                        <form name="newsletter" onSubmit={this.onSubmit}>
                            {
                                (this.state.newsletterError) ? (
                                    <label style={inputText}>{this.state.newsletterError}</label>
                                ) : (null)
                            }
                            <fieldset className="form-group">
                                <input ref={(ref) => { this.state.newsletterName = ref; }} type="text" style={inputText} name="newsletterName" className="form-element" style={{ borderColor: '#333333', color: '#ffffff' }} placeholder="Name"/>
                            </fieldset>
                            <fieldset className="form-group">
                                <input ref={(ref) => { this.state.newsletterEmail = ref; }} type="email" style={inputText} name="newsletterEmail" className="form-element" style={{ borderColor: '#333333', color: '#ffffff' }} placeholder="Email"/>
                            </fieldset>
                            <button type="submit" className="btn btn-army" >Subscribe</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Footer;