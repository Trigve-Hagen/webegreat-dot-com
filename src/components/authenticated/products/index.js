import React from 'react';
import { connect } from 'react-redux';
import Navigation from '../../navigation';

class Products extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            path: '/products',
            authenticated: this.props.authentication[0].authenticated
        }
    }

    componentDidMount() {
        console.log(this.state);
        this.props.updatePath({ path: this.state.path });
    }

    render() {
        const { path, authenticated } = this.state;
        return (
            <div>
                <Navigation path={path} authenticated={authenticated}/>
                <div className="container">
                    <h1>Products Page</h1>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        navigation: state.navigation,
        authentication: state.authentication
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updatePath: (value) => {
            dispatch( { type: 'UPDATE_PATH', payload: value} )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Products)