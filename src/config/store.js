import { createStore, combineReducers } from 'redux';
import cartReducer from '../components/cart/reducer';
import authenticationReducer from '../components/authentication/reducer'
import productReducer from '../components/authenticated/products/reducer';
import paginationReducer from '../components/product-components/pagination/reducer';

function saveToLocalStorage(state) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch(e) {
        console.log(e);
    }
}

function loadFromLocalStorage() {
    try {
        const serializedState = localStorage.getItem('state');
        if(serializedState === null) return undefined
        return JSON.parse(serializedState);
    } catch(e) {
        console.log(e);
        return undefined;
    }
}

const rootReducer = combineReducers({
    cart: cartReducer,
    product: productReducer,
    pagination: paginationReducer,
    authentication: authenticationReducer
});

const persistedState = loadFromLocalStorage();

const store = createStore(
    rootReducer,
    persistedState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(() => saveToLocalStorage(store.getState()));

export default store;