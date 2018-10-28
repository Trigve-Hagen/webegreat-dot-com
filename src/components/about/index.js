import React from 'react';
import { connect } from 'react-redux';
import Navigation from '../navigation';
import Footer from '../footer';
import { Player } from 'video-react';

function Honesty(props) {
  return (
    <Player
      playsInline
      poster={ `/img/memorial-day.jpg` }
      src={ `https://dms.licdn.com/playback/C5105AQH8AyEspFYsyA/058a9f235f49443ca949820c1199352a/feedshare-mp4_3300-captions-thumbnails/1507940147251-drlcss?e=1539367200&v=beta&t=SXAnwI1vqg7ru5jkY6dXowqR5Z2kGgFQccRgkiT--Y4` }
    />
  );
};

class About extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            windowHeight: 0,
            footerHeight: 0,
            menuHeight: 0
        }
	}

	componentDidMount() {
		//console.log(window.innerHeight + ", " + window.clientHeight + ", " + window.height)
        let windowHeight = isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight;
        let footerHeight = document.getElementsByClassName('webegreat-footer')[0].clientHeight;
        let menuHeight = document.getElementsByClassName('webegreat-menu')[0].clientHeight;
        this.setState({
            windowHeight: windowHeight,
            footerHeight: footerHeight,
            menuHeight: menuHeight
		});
	}

    render() {
        let containerHeight = this.state.windowHeight - (this.state.menuHeight + this.state.footerHeight);
        return (
            <div>
                <Navigation
                    path="/about"
                    authenticated={this.props.authentication[0].authenticated}
                    role={this.props.authentication[0].role}
                />
                <div
                    className="container"
                    style={{
                        minHeight: containerHeight + 'px'
                    }}
                >
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12">
                            <div className="row margin-top-20px margin-bottom-50px">
								<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                    <h1>About Page</h1>
                                    <h4>People are awesome</h4>
                                    <p>For those who have signed up I reload the whole site at webegreat.com to test nearly everytime I update the code at <a href="https://github.com/Trigve-Hagen/webegreat-dot-com" target="_blank">github</a>. if you see a something went wrong notice just reload by closing the old window then open a new one and type webegreat.com in the browser. If you are logged in and I reload the database the session that was created will not be there any more and your session will be invalid causing the forms to not work. Log out then log back in.</p>
                                    <br />
                                    <p>I have been following President Trump and to tell you the truth I was wondering why at first he was against illegal aliens. Not that I didn't understand but I didn't really see in depth what a few illegal aliens meant. It slowly has been dawning on me though that when we hire them and their population grows in an area. First they need a way to get here and from what I know good things carry a hefty price. So they either have to have money or they have to do something that will pay their way here. If you look at the drug problem here in Stockton and mix that with people burrowing to get here from Mexico you can make a connection that seems to me to be real. On top of it we have a city that has gone bankrupt and when you look at the taxes not being paid by the illegal aliens, the low wages in the area brought on by companies following the agriculture industry and the toll that drug addicts take on a system that has to support those who are incapacitated due to an addiction you have financial devastation of that magnitude. When taxes are being collected and the regular wages are between 11 and 15 an hour for most of the labor force that puts them in the lowest tax bracket. If they where in the 19 to 20 dollar tax bracket we would pull in 10 times the tax money we do now. That is still lower than the average American should be making and another ten times less than he should be paying in taxes leaving us without payed medical and a decaying economy. Any way we could get the agriculture industry to come together and open a gigantic car company with Tesla as an investor to sort of a leave the financial tension here? It be nice to have people making 20 an hour here. Mexican, White or Black.</p>
                                    <div className="embed-responsive embed-responsive-4by3 margin-top-20px">
                                        <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/AKBLKkg5ikk" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
                                    </div>
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