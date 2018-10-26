import React from 'react';

export default function MenuList(props) {
    return <ul className="ul-styles">
            {
                props.menuItems.map(menuItem => 
                    <li key={menuItem.id}> 
                        {menuItem.name} 
                        <a
                            href="#"
                            data-menuid={menuItem.id}
                            onClick={props.onView}
                        > View</a>  
                        <a
                            href="#"
                            data-menuid={menuItem.id}
                            onClick={props.onDelete}
                        > Delete</a> 
                    </li>
                )
            }
        </ul>
}