import React from 'react';

class Menu extends React.Component {
    render() {
        console.log(this.props.menu);
        return (
            <React.Fragment>

                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle dropdown-toggle-split" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />

                    <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        {
                            this.props.menu.map(item =>
                                item.ifproduct == 1
                                    ? <a className="dropdown-item" key={item.id} href="#" onClick={this.props.onClick} data-linkname={item.name}>{item.name}</a>
                                    : null
                            )
                        }
                    </div>
                </li>
                
            </React.Fragment>
        );
    }
}

export default Menu;