import { createStore, combineReducers } from 'redux';
import cartReducer from '../components/cart/reducer';
import roleReducer from '../components/authenticated/roles/reducer';
import authenticationReducer from '../components/authentication/reducer';
import paginationReducer from '../components/pagination/reducer';
import avatarReducer from '../components/authenticated/profile/reducer';
import searchReducer from '../components/search-bar/reducer';
import mordersReducer from '../components/authenticated/merchant-orders/reducer';
import cordersReducer from '../components/authenticated/customer-orders/reducer';
import visibilityReducer from '../components/authenticated/profile/store-controls/store-visibility/reducer';

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
    role: roleReducer,
    avatar: avatarReducer,
    search: searchReducer,
    morders: mordersReducer,
    corders: cordersReducer,
    pagination: paginationReducer,
    visibility: visibilityReducer,
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