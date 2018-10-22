import React from 'react';
import { connect } from 'react-redux';
import Pagination from '../../pagination';
import config from '../../../config/config';

class MenuList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        //this.props.resetMenu();
        return (
            <div>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        <Pagination
                            database="frontmenu"
                            perPage={config.per_page}
                            token={this.props.authentication[0].token}
                        />
                        <ul className="ul-styles">
                            {
                                this.props.menuItems.map(menuItem => 
                                    <li key={menuItem.id}> 
                                        {menuItem.name} 
                                        <a
                                            href="#"
                                            data-menuid={menuItem.id}
                                            onClick={this.props.onView}
                                        > View</a>  
                                        <a
                                            href="#"
                                            data-menuid={menuItem.id}
                                            onClick={this.props.onDelete}
                                        > Delete</a> 
                                    </li>
                                )
                            }
                        </ul>
                        <Pagination
                            database="frontmenu"
                            perPage={config.per_page}
                            token={this.props.authentication[0].token}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        menu: state.menu,
        pagination: state.pagination,
        authentication: state.authentication
    }
}

export default connect(mapStateToProps)(MenuList);