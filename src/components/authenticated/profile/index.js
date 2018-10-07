import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Navigation from '../../navigation';
import AvatarImage from './avatar-image';
import StoreControls from './store-controls';
import UpdateProfile from './update-profile';
import UpdatePassword from './update-password';
import Footer from '../../footer';
import UpdatePaypal from './update-paypal';
import config from '../../../config/config';

class Profile extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(this.props.authentication[0].authenticated && this.props.authentication[0].role == 1) {
            return (
                <div>
                    <Navigation path="/profile" authenticated={this.props.authentication[0].authenticated} role={this.props.authentication[0].role}/>
                    <div className="container">
                        <div className="row space-bottom-50px">
                            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-24">
                                <h1>Profile Page</h1>
                                <AvatarImage />
                            </div>
                            <div className="col-lg-8 col-md-8 col-sm-12 col-xs-24">
                                <UpdateProfile />
                                <UpdatePassword />
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            )
        } else if(this.props.authentication[0].authenticated && this.props.authentication[0].role == 3) {
            return (
                <div>
                    <Navigation path="/profile" authenticated={this.props.authentication[0].authenticated} role={this.props.authentication[0].role}/>
                    <div className="container">
                        <div className="row space-bottom-50px">
                            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-24">
                                <h1>Profile Page</h1>
                                <AvatarImage />
                                <StoreControls />
                            </div>
                            <div className="col-lg-8 col-md-8 col-sm-12 col-xs-24">
                                <UpdateProfile />
                                <UpdatePaypal />
                                <UpdatePassword />
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            )
        } else return <Redirect to='/' />;
    }
}

function mapStateToProps(state) {
    return {
        role: state.role,
        authentication: state.authentication
    }
}

export default connect(mapStateToProps)(Profile)