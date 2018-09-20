import React from 'react';
import { connect } from 'react-redux';

const style = {
    marginTop: '10px'
}

class ProductList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products = [],
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
            password,
            rePassword
		} = this.state;

		fetch('http://localhost:4000/api/account/upload-image', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
                password: password,
                rePassword: rePassword
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
        const { password, rePassword, passwordError } = this.state;
        return (
            <div className="row space-top-20px space-bottom-50px">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-24">
                    <h1>Army Shop</h1>
                    <div className="product-listing" style={style}>
                        {
                            props.products.map( product =>
                                <ProductItem key={product.id}
                                    product={product}
                                    addToCart={props.addToCart}
                                    removeFromCart={props.removeFromCart}
                                    cartItem={props.cart.filter(cartItem => cartItem.id === product.id)[0]}
                                />
                            )
                        }
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

export default connect(mapStateToProps)(ProductList)