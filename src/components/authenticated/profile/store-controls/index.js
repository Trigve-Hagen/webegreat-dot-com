import React from 'react';
import StoreVisibility from './store-visibility';
import CheckPaypal from './check-paypal';

class StoreControls extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="row margin-top-20px">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        <StoreVisibility />
                    </div>
                </div>
                <div className="row margin-top-20px">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        <CheckPaypal/>
                    </div>
                </div>
            </div>
        )
    }
}

export default StoreControls;