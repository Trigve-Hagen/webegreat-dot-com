import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Navigation from '../../navigation';
import Footer from '../../footer';
import Pagination from '../../pagination';
import MenuList from './menu-list';
import UpdateMenu from './update-menu';
import UploadMenu from './upload-menu';
import MenuDisplay from './menu-display';
import MenuItem from './menu-item';
import config from '../../../config/config';

class MenuMaker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadMenuError: '',
            perPage: config.per_page,
            currentPage: 1,
            loadMenuItem: [],
            loadMenuItems: [],
            pages: []
        }
        this.onView = this.onView.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onChangePagination = this.onChangePagination.bind(this);
    }

    fetchMenu() {
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
                        loadMenuItem: arrayArgs[0],
                        loadMenuItems: arrayArgs
                    });
				} else {
                    this.setState({
						loadMenuError: json.message
					});
                }
			});
    }

    fetchPages() {
        fetch(config.site_url + '/api/database/pagination', {
            method: 'POST',
            headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
                db: "frontmenu",
				perPage: this.state.perPage
			})
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    let range = [];
                    for(let i = 1; i <= json.pages; i++) range.push(i);
                    this.setState({
                        pages: range,
                        loadProductError: json.message
					});
				} else {
                    this.setState({
                        loadProductError: json.message
					});
                }
			});
    }

    componentDidMount() {
        this.fetchPages();
		this.fetchMenu();
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

    onChangePagination(e) {
        if(e.target.dataset.currentpage !== undefined) {
            this.setState({ currentPage: e.target.dataset.currentpage });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.currentPage !== this.state.currentPage) {
            this.setState({ currentPage: this.state.currentPage });
            this.fetchPages();
            this.fetchMenu();
        }
    }

    onView(e) {
        this.setState({ loadMenuItem: this.getMenuObject(e.target.dataset.menuid) });
    }

    onDelete(e) {
        let menuId = e.target.dataset.menuid;
        let menuObject = this.getMenuObject(menuId);
        if (confirm(`Are you sure you want to delete ${menuObject.name}?`)) {
            fetch(config.site_url + '/api/menu/delete-item', {
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
                    location.reload();
				} else {
                    this.setState({
						loadProductError: json.message
					});
                }
			});
        }
    }

    render() {
        if(this.props.authentication[0].authenticated && this.props.authentication[0].role == 3) {
            return (
                <div>
                    <Navigation path="/menu" authenticated={this.props.authentication[0].authenticated} role={this.props.authentication[0].role}/>
                    <div className="container">
                        <div className="row margin-top-20px">
                            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-24">
                                <h2>Create Menu</h2>
                                {
                                    (this.state.loadMenuError) ? (
                                        <label>{this.state.loadMenuError}</label>
                                    ) : (null)
                                }
                                <Pagination
                                    pages={this.state.pages}
                                    perPage={this.state.perPage}
                                    currentPage={this.state.currentPage}
                                    onChangePagination={this.onChangePagination}
                                />
                                    <MenuList
                                        menuItems={this.state.loadMenuItems}
                                        onView={this.onView}
                                        onDelete={this.onDelete}
                                    />
                                <Pagination
                                    pages={this.state.pages}
                                    perPage={this.state.perPage}
                                    currentPage={this.state.currentPage}
                                    onChangePagination={this.onChangePagination}
                                />
                                <UploadMenu menuItems={this.state.loadMenuItems}/>
                            </div>
                            <div className="col-lg-8 col-md-8 col-sm-12 col-xs-24">
                                <MenuDisplay menuItems={this.state.loadMenuItems} />
                                <MenuItem menu={this.state.loadMenuItem} />
                                <UpdateMenu
                                    menuItems={this.state.loadMenuItems}
                                    menu={this.state.loadMenuItem}
                                />
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