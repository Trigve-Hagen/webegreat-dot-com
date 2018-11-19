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

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            windowHeight: 0,
            footerHeight: 0,
            menuHeight: 0,
        }
    }

    componentDidMount() {
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
        console.log(containerHeight);
        if(this.props.authentication[0].authenticated && this.props.authentication[0].role == 1) {
            return (
                <div>
                    <Navigation path="/profile" authenticated={this.props.authentication[0].authenticated} role={this.props.authentication[0].role}/>
                    <div
                        className="container"
                        style={{
                            minHeight: containerHeight + 'px'
                        }}
                    >
                        <div className="row my-3">
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
                                <h2>Profile Page</h2>
                                <AvatarImage />
                            </div>
                            <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12">
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
                    <div
                        className="container"
                        style={{
                            minHeight: containerHeight + 'px'
                        }}
                    >
                        <div className="row my-3">
                            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
                                <h1>Profile Page</h1>
                                <AvatarImage />
                                <StoreControls />
                            </div>
                            <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12">
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