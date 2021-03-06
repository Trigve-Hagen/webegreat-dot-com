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
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            <div className="row my-3">
								<div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                    <h1>About Page</h1>
                                    <h4>People are awesome</h4>
                                    <p>For those who have signed up I reload the whole site at webegreat.com to test nearly everytime I update the code at <a href="https://github.com/Trigve-Hagen/webegreat-dot-com" target="_blank">github</a>. if you see a something went wrong notice just reload by closing the old window then open a new one and type webegreat.com in the browser. If you are logged in and I reload the database the session that was created will not be there any more and your session will be invalid causing the forms to not work. Log out then log back in.</p>
                                    <p>I had an idea recently to create games that use a football pool style gambling implementation to allow seniors over 65 to gamble for free with a chance to win. Earlier I saw a video that talked of an older women who had left 500 at an ATM where when it was recovered was going to give as a reward the only 20 that would have been left over out of it after paying her rent to the girl who turned it in to the bank. I was touched by the video and came up with this idea to help those who are not doing so well and over 65 with a way to make some extra money easily. Those under 65 pay the fee for entry and the dollar or two  into the pot for a chance to win the whole amount. People over 65 can bet on the game without paying the entry fee or the dollar value. Who ever wins gets the pot. So this is my first endeavor. I hope to find a cool Indian to go into business with.</p>
                                    <div className="embed-responsive embed-responsive-4by3 mt-3">
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