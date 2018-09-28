import React from 'react';
import { connect } from 'react-redux';
import config from '../../../config/config';

class AvatarImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            avatarError: '',
            avatarUploadInput: '',
            avatarFileName: ''
        }
        this.onSubmit = this.onSubmit.bind(this);
    }

	onSubmit(e) {
        e.preventDefault();

        const data = new FormData();
            data.append('file', this.state.avatarUploadInput.files[0]);
            data.append('filename', this.state.avatarFileName.value);
            data.append('token', this.props.authentication[0].token);
            data.append('imagename', this.props.avatar[0].avatar);

		fetch(config.site_url + '/api/avatar/update-avatar', {
            method: 'POST',
            body: data,
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    console.log("Avatar update successfull.");
                    this.props.updateAvatar({ avatar: json.avatar });
					this.setState({
                        avatarError: json.message,
                        avatar: json.avatar,
                        avatarUploadInput: '',
                        avatarFileName: ''
                    });
				} else {
                    this.setState({
						avatarError: json.message
					});
                }
			});
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        <img src={ `/img/avatar/${ this.props.avatar[0].avatar }` } alt="Army Strong" className="img-responsive"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        <h3>Avatar Upload</h3>
                        {
                            (this.state.avatarError) ? (
                                <label>{this.state.avatarError}</label>
                            ) : (null)
                        }
                        <form className="updateAvatar" onSubmit={this.onSubmit}>
                            <fieldset className="form-group">
                                <input ref={(ref) => { this.state.avatarUploadInput = ref; }} type="file" className="form-control-file btn btn-army"/>
                            </fieldset>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                                <fieldset className="form-group">
                                    <input ref={(ref) => { this.state.avatarFileName = ref; }} type="text" className="form-element" placeholder="desired-name-of-file" />
                                </fieldset>
                            </div>
                            <button type="submit" className="btn btn-army">Update Avatar</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        avatar: state.avatar,
        authentication: state.authentication
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateAvatar: (value) => {
            dispatch( { type: 'UPDATE_AVATAR', payload: value} )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AvatarImage);