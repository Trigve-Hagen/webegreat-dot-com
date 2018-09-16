import React from 'react';
import { connect } from 'react-redux';

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

function Cart(props) {
    return <div>
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
                            sort(props.cart).map( item => <tr key={item.id}>
                                <td>{ item.name }</td>
                                <td>{ item.quantity }</td>
                                <td>
                                    <button onClick={() => props.addToCart(item)}>+</button>
                                    <button onClick={() => props.removeFromCart(item)}>-</button>
                                </td>
                                <td><button onClick={() => props.removeAllFromCart(item)}>Remove All</button></td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
}

function mapStateToProps(state) {
    return {
        cart: state.cart,
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