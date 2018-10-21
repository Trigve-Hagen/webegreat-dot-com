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
            <div className="navbar navbar-dark bg-dark">
                <div className="container margin-bottom-50px">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                        <p className="footer-para-text">© 2018 - Site Built By Trigve Hagen</p>
                        <p className="footer-para-text margin-bottom-20px">Trigve Hagen (209) 452-2699</p>
                        <a href="http://www.globalwebmethods.com" target="_blank" className="footer-link-text">Symfony - globalwebmethods.com</a><br />
                        <a href="http://arcsvcs.com" target="_blank" className="footer-link-text">Laravel - arcsvcs.com</a><br />
                        <a href="http://docrx.online" target="_blank" className="footer-link-text">Magento 2 - docrx.online</a><br />
                        <a href="https://webegreat.com" target="_blank" className="footer-link-text">React - webegreat.com</a><br />
                        <a href="https://bestspot2shop.com" target="_blank" className="footer-link-text">Custom Php - bestspot2shop.com</a><br />
                        <a href="https://github.com/Trigve-Hagen/webegreat-dot-com" target="_blank" className="footer-link-text">Github Repo - webegreat.com</a><br />
                        <a href="https://github.com/Trigve-Hagen" target="_blank" className="footer-link-text">GitHub</a>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 margin-top-20px">
                        <h2 style={inputText}>Newsletter</h2>
                        <form name="newsletter" onSubmit={this.onSubmit}>
                            {
                                (this.state.newsletterError) ? (
                                    <label style={inputText}>{this.state.newsletterError}</label>
                                ) : (null)
                            }
                            <fieldset className="form-group">
                                <input ref={(ref) => { this.state.newsletterName = ref; }} type="text" style={inputText} name="newsletterName" className="form-element" placeholder="Name"/>
                            </fieldset>
                            <fieldset className="form-group">
                                <input ref={(ref) => { this.state.newsletterEmail = ref; }} type="email" style={inputText} name="newsletterEmail" className="form-element" placeholder="Email"/>
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