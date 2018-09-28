const initialState = {
    "products": "products"
}

const frontMenuReducer = (state=[initialState], action) => {
    switch(action.type) {
        case 'UPDATE_MENU':
            state=[];
            return [...state, action.payload];
        default:
            return state;
    }
}

export default frontMenuReducer;