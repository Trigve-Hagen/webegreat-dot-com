import React from 'react';
import { connect } from 'react-redux';
import Navigation from '../navigation';

/*export const cartItemsWithQuantities = (cartItems) => {
    return cartItems.reduce((acc, item) => {
        const filteredItem = acc.filter(item2 => item2.id === item.id)[0]
        filteredItem !== undefined
            ? filteredItem.quantity++
            : acc.push({ ...item, quantity: 1 })
        return acc;
    }, [])
}*/

function sort(items) {
    return items.sort((a, b) => a.id < b.id);
}

class Cart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            path: '/cart',
            authenticated: this.props.authentication[0].authenticated
        }
    }

    render() {
        const { path, authenticated } = this.state;
        return (
            <div>
                <Navigation path={path} authenticated={authenticated}/>
                <div className="container">
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quality</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                sort(this.props.cart).map( item => <tr key={item.id}>
                                    <td>{ item.name }</td>
                                    <td>{ item.quantity }</td>
                                    <td>
                                        <button onClick={() => this.props.addToCart(item)}>+</button>
                                        <button onClick={() => this.props.removeFromCart(item)}>-</button>
                                    </td>
                                    <td><button onClick={() => this.props.removeAllFromCart(item)}>Remove All</button></td>
                                </tr>)
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        cart: state.cart,
        authentication: state.authentication
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addToCart: (item) => {
            dispatch({ type: 'ADD', payload: item })
        },
        removeFromCart: (item) => {
            dispatch({ type: 'REMOVE', payload: item })
        },
        removeAllFromCart: (item) => {
            dispatch({ type: 'REMOVE_ALL', payload: item })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);