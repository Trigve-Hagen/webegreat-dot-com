import React from 'react';
import { connect } from 'react-redux';
import Navigation from '../navigation';
import Footer from '../footer';
import ArmyOne from './army-one';
import ArmyTwo from './army-two';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            animate: false
        }
    }

    render() {
        return (
            <div>
                <Navigation
                    path="/home"
                    authenticated={this.props.authentication[0].authenticated}
                    role={this.props.authentication[0].role}
                />
                <ArmyOne />
                <ArmyTwo />
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