import React from 'react';
import { connect } from 'react-redux';
import Pagination from '../../product-components/pagination';
import config from '../../../config/config';

class MenuList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadMenuError: '',
            loadMenuItems: []
        }
        this.onView = this.onView.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    componentDidMount() {
		fetch(config.site_url + '/api/menu/front', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: this.props.authentication[0].token
			})
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    let arrayArgs = [];
                    for (let value of Object.values(json.menuItems)) {
                        arrayArgs.push({
                            id: value['menuid'],
                            name: value['name'],
                            level: value['level'],
                            parent: value['parent'],
                            description: value['description'],
                            ifproduct: value['if_product']
                        });
                    }
                    //console.log(arrayArgs);
                    this.setState({
                        loadMenuError: json.message,
                        loadMenuItems: arrayArgs
                    });
				} else {
                    this.setState({
						loadMenuError: json.message
					});
                }
			});
    }

    getMenuObject(menuId) {
        let obj={};
        this.state.loadMenuItems.map(item => {
            if(item.id == menuId) {
                obj.id = item.id;
                obj.name = item.name;
                obj.level = item.level;
                obj.parent = item.parent;
                obj.description = item.description;
                obj.ifproduct = item.ifproduct;
            }
        });
        return obj;
    }

    onView(menuId) {
        this.props.updateMenu(this.getMenuObject(menuId));
    }

    onDelete(menuId) {
        console.log(menuId);
        let menuObject = this.getMenuObject(menuId);
        if (confirm(`Are you sure you want to delete ${menuObject.name}?`)) {
            fetch(config.site_url + '/api/menu/delete-menu-item', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
                id: menuId,
                token: this.props.authentication[0].token
			})
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    let arrayArgs = [];
                    this.state.loadMenuItems.map(item => {
                        if(menuId != item.id) {
                            arrayArgs.push({
                                id: item.id,
                                name: item.name,
                                level: item.level,
                                parent: item.parent,
                                description: item.description,
                                ifproduct: item.ifproduct
                            });
                        }
                    });
                    this.setState({
                        loadProductError: json.message,
                        loadMenuItems: arrayArgs
                    });
                    this.props.updateMenu({
                        id: arrayArgs[0].id,
                        name: arrayArgs[0].name,
                        level: arrayArgs[0].level,
                        parent: arrayArgs[0].parent,
                        description: arrayArgs[0].description,
                        ifproduct: arrayArgs[0].ifproduct
                    });
                    //location.reload();
				} else {
                    this.setState({
						loadProductError: json.message
					});
                }
			});
        }
    }

    render() {
        //this.props.resetMenu();
        console.log(this.state.loadMenuItems);
        return (
            <div>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        {
                            (this.state.loadMenuError) ? (
                                <label>{this.state.loadMenuError}</label>
                            ) : (null)
                        }
                        <Pagination />
                        <ul className="ul-styles">
                            {
                                this.state.loadMenuItems.map(menuItem => 
                                    <li key={menuItem.id}> 
                                        {menuItem.name} 
                                        <a href="#" onClick={() => this.onView(menuItem.id)}> View</a>  
                                        <a href="#" onClick={() => this.onDelete(menuItem.id)}> Delete</a> 
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
        menu: state.menu,
        pagination: state.pagination,
        authentication: state.authentication
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateMenu: (value) => {
            dispatch({ type: 'UPDATE_MENU', payload: value})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuList);