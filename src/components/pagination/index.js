import React from 'react';

export default function Pagination(props) {
    return <ul className="pagination">
            {
                props.pages.map(page => 
                    page == props.currentPage
                        ? <li key={page.toString()} className="active"><a data-currentpage={page} onClick={props.onChangePagination} className="btn btn-army"><strong>{page}</strong></a></li>
                        : <li key={page.toString()}><a data-currentpage={page} onClick={props.onChangePagination} className="btn btn-army">{page}</a></li>
                )
            }
        </ul>
}