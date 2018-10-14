import React from 'react';
import { connect } from 'react-redux';
import config from '../../../config/config';

class MenuDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadMenuError: '',
            loadMenuItems: []
        }
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

    render() {
        let menuString = []; let level1Count = 0;
        this.state.loadMenuItems.forEach(level1 => {
            if(level1.level == 0) {
                menuString.push({ name: level1.name, iflink: false, link: "#", children: [] });
                let level2Count = 0;
                this.state.loadMenuItems.forEach(level2 => {
                    if(level2.level == 1 && level2.parent == level1.name) {
                        //console.log(level1Count + ", " + level2.name);
                        if(level2.ifproduct == 1) menuString[level1Count]['children'].push({ name: level2.name, iflink: true, link: "#", children: [] });
                        else menuString[level1Count]['children'].push({ name: level2.name, iflink: false, link: "#", children: [] });
                        this.state.loadMenuItems.forEach(level3 => {
                            if(level3.level == 2 && level3.parent == level2.name) {
                                //console.log(level2Count + ", " + level3.name);
                                if(level3.ifproduct == 1) menuString[level1Count]['children'][level2Count]['children'].push({ name: level3.name, iflink: true, link: "#", children: [] });
                                else menuString[level1Count]['children'][level2Count]['children'].push({ name: level3.name, iflink: false, link: "#", children: [] });
                            }
                        });
                        level2Count++;
                    }
                });
                level1Count++;
            }
        });
        //console.log(menuString);
        return (
            <div className="row space-top-20px space-bottom-50px">
                <div className="col-lg-12 col-md-12 col-sm-12 col xs-24">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col xs-24">
                            <nav>
                                <div className="menu-item alpha">
                                    <h3>Army Strong</h3>
                                    <p>We have a large selection of Army products for sale including shirts, hats, belts, backpacks and much much more. Please have a look around and feel free to get a hold of a sales representative through the chat application at the bottom of the screen. Thanks for your service.</p>
                                </div>
                                <div className="menu-item">
                                    {
                                        menuString.map((level1, index) => 
                                            <div key={index} className="menu-item"><h4>{level1.name}</h4><ul>
                                            {
                                                level1.children.map((level2, index) =>
                                                    level2.iflink
                                                        ? <li key={index}><a href={level2.link} onClick={this.props.onClick} data-linkname={level2.name}>{level2.name}</a></li>
                                                        : <li key={index}>{level2.name}<ul>
                                                            {
                                                                level2.children.map((level3, index) =>
                                                                    <li key={index}><a href={level3.link} onClick={this.props.onClick} data-linkname={level3.name}>{level3.name}</a></li>
                                                                )
                                                            }
                                                        </ul></li>
                                                )
                                            }
                                            </ul></div>
                                        )
                                    }
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        menu: state.menu,
        authentication: state.authentication
    }
}

export default connect(mapStateToProps)(MenuDisplay)