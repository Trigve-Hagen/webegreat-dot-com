import React from 'react';

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

		fetch('http://localhost:4000/api/newsletter/registration', {
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
            <div className="navbar navbar-inverse navbar-static-bottom rounded-0">
                <div className="container">
                    <div className="row space-top-20px">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                            <p className="navbar-text pull-left">© 2018 - Site Built By Trigve Hagen</p>

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
            </div>
        )
    }
}

export default Footer;