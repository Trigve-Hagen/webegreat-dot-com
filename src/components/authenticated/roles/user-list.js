import React from 'react';

export default function UserList(props) {
    return <ul className="ul-styles">
            {
                props.users.map(user => 
                    <li key={user.id}> 
                        {user.name} 
                        <a href="#" data-userid={user.id} onClick={props.onView}> View</a>  
                        <a href="#" data-userid={user.id} onClick={props.onDelete}> Delete</a> 
                    </li>
                )
            }
        </ul>
}