import React from 'react';
import { connect } from 'react-redux';
import config from '../../../config/config';

function uniqueId(id) {
    return parseInt(id) - 50 * 2;
}

class AvatarImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            avatarError: '',
            avatarId: '',
            avatarUploadInput: '',
            avatarFileName: '',
            avatarImage: ''
        }
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
		fetch(config.site_url + '/api/avatar/get-avatar', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				token: this.props.authentication[0].token
			})
		}).then(res => res.json())
			.then(json => {
				if(json.success) {
                    //console.log("avatar:" + json.avatar);
					this.setState({
                        avatarError: json.message,
                        avatarId: json.id,
                        avatarImage: json.avatar
                    });
				} else {
                    this.setState({
						avatarError: json.message
					});
                }
			});
    }

	onSubmit(e) {
        e.preventDefault();
        // WARNING in asset size limit:
        // The following asset(s) exceed the recommended size limit (244 KiB).
        // So 244 X 1024 = 249856 because (bytes / 1024).toFixed(3) + " KB";
        // Please keep all images under 244KB of React recommended size limit.
        if(config.allowed_images.includes(this.state.avatarUploadInput.files[0].type)) {
            if(this.state.avatarUploadInput.files[0].size < 249856) {
                if(this.state.avatarUploadInput.files[0].size > 0) {
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
                                    avatarId: jason.folderid,
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
                    } else this.setState({ avatarError: 'File is less than 0 bytes.' });
                } else this.setState({ avatarError: 'File is bigger than 244 KB.' });
            } else this.setState({ avatarError: 'Invalid image type. Jpeg, jpg, gif or pngs allowed.' });
    }

    render() {
        //this.props.resetAvatar();
        let avatarUrl = uniqueId(this.state.avatarId);
        //console.log(avatarUrl);
        return (
            <div>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        <img src={ `/img/avatar/${avatarUrl}/${this.state.avatarImage}` } alt="Army Strong" className="img-fluid"/>
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
        },
        resetAvatar: (value) => {
            dispatch( { type: 'RESET_AVATAR', payload: value} )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AvatarImage);