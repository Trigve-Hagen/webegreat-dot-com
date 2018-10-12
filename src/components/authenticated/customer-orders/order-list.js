import React from 'react';
import { connect } from 'react-redux';
import Pagination from '../../product-components/pagination';

class OrderList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        //this.props.resetOrders();
        return (
            <div>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        <Pagination />
                        <ul className="ul-styles">
                            {
                                this.props.orders.map(order => 
                                    <li key={order.id}> 
                                        {order.date} {order.name} <a href="#" data-orderid={order.id} onClick={this.props.onView}>View</a> 
                                    </li>
                                )
                            }
                        </ul>
                        <Pagination />
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        pagination: state.pagination,
        authentication: state.authentication
    }
}

export default connect(mapStateToProps)(OrderList);