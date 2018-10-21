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
            <div className="row margin-top-20px">
                <div className="col-lg-12 col-md-12 col-sm-12 col xs-24">
                    {
                        (this.state.searchError) ? (
                            <label>{this.state.searchError}</label>
                        ) : (null)
                    }
                    <form
                        name="search"
                        onSubmit={this.props.onSubmit}
                        data-searchstring={this.state.searchString}
                    >
                        <div className="input-group mb-3">
                            <input
                                value={this.state.searchString}
                                onChange={this.onChange}
                                name="searchString"
                                type="text"
                                className="form-control"
                                placeholder="Search for..."
                                aria-label="Search for..."
                                aria-describedby="button-addon2"
                            />
                            <div className="input-group-append">
                                <button
                                    className="btn btn-army"
                                    type="submit"
                                    id="button-addon2"
                                >Go!</button>
                            </div>
                        </div>
                    </form>
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