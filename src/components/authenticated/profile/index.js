import React from 'react';
import { connect } from 'react-redux';
import Navigation from '../../navigation';
import AvatarImage from './avatar-image';
import StoreControls from './store-controls';
import UpdateProfile from './update-profile';
import UpdatePassword from './update-password';
import Footer from '../../footer';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            path: '/profile',
            authenticated: this.props.authentication[0].authenticated
        }
    }

    componentDidMount() {
        console.log(this.state);
    }

    render() {
        const { path, authenticated } = this.state;
        return (
            <div>
                <Navigation path={path} authenticated={authenticated}/>
                <div className="container">
                    <div className="row space-bottom-50px">
                        <div className="col-lg-4 col-md-4 col-sm-12 col-xs-24">
                            <h1>Profile Page</h1>
                            <AvatarImage />
                            <StoreControls />
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
    }
}

function mapStateToProps(state) {
    return {
        authentication: state.authentication
    }
}

export default connect(mapStateToProps)(Profile)