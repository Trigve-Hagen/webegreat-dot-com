import React from 'react';

export default function MenuDisplay(props) {
    let menuString = []; let level1Count = 0;
    props.menuItems.forEach(level1 => {
        if(level1.level == 0 && level1.ifactive && !level1.ifdropdown) {
            menuString.push({ index: level1Count, name: level1.name, ifproduct: level1.ifproduct, ifdropdown: level1.ifdropdown, children: [] });
            let level2Count = 0;
            props.menuItems.forEach(level2 => {
                if(level2.level == 1 && level2.parent == level1.name && level2.ifactive && !level2.ifdropdown) {
                    menuString[level1Count]['children'].push({ index: level2Count, name: level2.name, ifproduct: level2.ifproduct, ifdropdown: level2.ifdropdown, children: [] });
                    let level3Count = 0;
                    props.menuItems.forEach(level3 => {
                        if(level3.level == 2 && level3.parent == level2.name && level3.ifactive && !level3.ifdropdown) {
                            menuString[level1Count]['children'][level2Count]['children'].push({ index: level3Count, name: level3.name, ifproduct: level3.ifproduct, ifdropdown: level3.ifdropdown, children: [] });
                            level3Count++;
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
        <div className="row menu-mobile">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                <nav>
                    <div className="menu-item">
                        <h3>Army Strong</h3>
                        <a href="#" onClick={props.onClick} data-linkname="all" className="display-all-products my-3">Display All Products</a>
                    </div>
                    <div className="menu-item">
                        {
                            menuString.map(level1 => 
                                <div key={level1.index} className="menu-item">
                                <h4 className="mb-1">{level1.name}</h4><ul>
                                {
                                    level1.children.map(level2 =>
                                        level2.ifproduct
                                            ? <li key={level2.index} className="mb-1"><a href="#" onClick={props.onClick} data-linkname={level2.name}>{level2.name}</a></li>
                                            : <li key={level2.index} className="mb-1"><i>{level2.name}</i><ul>
                                                {
                                                    level2.children.map(level3 =>
                                                        <li key={level3.index} className="mb-1"><a href="#" onClick={props.onClick} data-linkname={level3.name}>{level3.name}</a></li>
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
    )
}