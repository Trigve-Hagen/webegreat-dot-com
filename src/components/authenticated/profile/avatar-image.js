import React from 'react';
import { connect } from 'react-redux';
//import Images from '../../../assets/img/images';
import user from '../../../assets/img/user.jpg';

class AvatarImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageError: '',
            imageFile: '',
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
		this.setState({ [e.target.name]: e.target.value});
	}

	onSubmit(e) {
        e.preventDefault();
        const {
			imageFile
		} = this.state;

		fetch('http://localhost:4000/api/account/upload-image', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				image: imageFile
			})
		}).then(res => res.json())
			.then(json => {
				/*if(json.success) {
                    console.log("Successfull SignIn." + json.token);
					this.props.updateAuth({ authenticated: true, token: json.token });
					this.setState({
                        loginError: json.message,
                        loginRedirect: true
					});
                    
				} else {
                    this.setState({
						loginError: json.message
					});
                }*/
			});
    }

    render() {
        const { imageError, imageFile } = this.state;
        return (
            <div>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        <img src={user} alt="Army Strong" className="img-responsive"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                        <h3>Avatar Upload</h3>
                        {
                            (imageError) ? (
                                <label>{imageError}</label>
                            ) : (null)
                        }
                        <form className="updateAvatar" onSubmit={this.onSubmit}>
                            <fieldset className="form-group">
                                <input value={imageFile} onChange={this.onChange} type="file" className="form-control-file btn btn-army"/>
                            </fieldset>
                            <button type="submit" className="btn btn-army">Upload Avatar</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        authentication: state.authentication
    }
}

export default connect(mapStateToProps)(AvatarImage)