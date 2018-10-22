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

class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Navigation
                    path="/home"
                    authenticated={this.props.authentication[0].authenticated}
                    role={this.props.authentication[0].role}
                />
                <div className="container">
                    <div className="row margin-top-20px margin-bottom-50px">
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-24">
                            <h2>If it seems brocken..</h2>
                            <p>For those who have signed up log out and log back in. I reload the whole site to test the install system and Arm system nearly everytime I update the code at github. If you are logged in and I do that the session that was created will not be there any more and your session will be invalid causing the forms to not work.</p>
                            <div className="embed-responsive embed-responsive-4by3 margin-top-20px">
                                <iframe className="embed-responsive-item" src="https://www.youtube.com/embed/AKBLKkg5ikk" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-24">
                            <h1>Home Page</h1>
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

export default connect(mapStateToProps)(Home)