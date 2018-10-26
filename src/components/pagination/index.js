import React from 'react';

export default function Pagination(props) {
    return <ul className="pagination">
            {
                props.pages.map(page => 
                    page == props.currentPage
                        ? <li key={page} className="page-item active"><a className="page-link" data-currentpage={page} onClick={props.onChangePagination}><strong>{page}</strong></a></li>
                        : <li key={page} className="page-item"><a className="page-link" data-currentpage={page} onClick={props.onChangePagination}>{page}</a></li>
                )
            }
        </ul>
}