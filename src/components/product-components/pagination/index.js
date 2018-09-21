import React from 'react';
import { connect } from 'react-redux';

class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: [],
            perPage: 15,
            pagesError: ''
        }

        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
		fetch('http://localhost:4000/api/product/pagination', {
            method: 'POST',
            headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				perPage: this.state.perPage
			})
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    let range = [];
                    for(let i = 1; i <= json.pages; i++) range.push(i);
                    //console.log(json.pages);
                    this.setState({
                        pages: range,
                        pagesError: json.message
					});
				} else {
                    this.setState({
                        pagesError: json.message
					});
                }
			});
    }

    onClick(page) {
        this.props.updatePagination({ currentPage: page });
    }

    render() {
        console.log(this.state.pages);
        return (
            <div>
                <ul className="pagination">
                    {
                        this.state.pages.map(page => 
                            page == this.props.pagination[0].currentPage
                                ? <li key={page.toString()} className="active"><a onClick={() => this.onClick(page)}><strong>{page}</strong></a></li>
                                : <li key={page.toString()}><a onClick={() => this.onClick(page)}>{page}</a></li>
                        )
                    }
                </ul>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        pagination: state.pagination
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updatePagination: (value) => {
            dispatch({ type: 'ADD_CURRENT_PAGE', payload: value})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Pagination);