import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Navigation from '../../navigation';
import Footer from '../../footer';
import MenuList from './menu-list';
import UpdateMenu from './update-menu';
import UploadMenu from './upload-menu';
import MenuDisplay from './menu-display';
import MenuItem from './menu-item';

class MenuMaker extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(this.props.authentication[0].authenticated && this.props.authentication[0].role == 3) {
            return (
                <div>
                    <Navigation path="/menu" authenticated={this.props.authentication[0].authenticated} role={this.props.authentication[0].role}/>
                    <div className="container">
                        <div className="row space-top-20px space-bottom-50px">
                            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-24">
                                <h2>Create Menu</h2>
                                <MenuList />
                                <UploadMenu />
                            </div>
                            <div className="col-lg-8 col-md-8 col-sm-12 col-xs-24">
                                <MenuDisplay />
                                <MenuItem />
                                <UpdateMenu />
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
        authentication: state.authentication
    }
}

export default connect(mapStateToProps)(MenuMaker)