import React from 'react';
import { connect } from 'react-redux';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
			searchError: '',
			searchString: ''
		}
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}

    render() {
        return (
            <div className="row space-top-20px">
                <div className="col-lg-12 col-md-12 col-sm-12 col xs-24">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col xs-24">
                            {
                                (this.state.searchError) ? (
                                    <label>{this.state.searchError}</label>
                                ) : (null)
                            }
                            <form name="search" onSubmit={this.props.setSearchParam} data-searchstring={this.state.searchString}>
                                <div className="input-group">
                                    <input value={this.state.searchString} onChange={this.onChange} type="text" name="searchString" className="form-element" placeholder="Search for..." />
                                    <span className="input-group-btn">
                                        <button className="btn btn-army" type="submit">Go!</button>
                                    </span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        search: state.search,
        authentication: state.authentication
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateSearch: (value) => {
            dispatch( { type: 'UPDATE_SEARCH', payload: value} )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar)