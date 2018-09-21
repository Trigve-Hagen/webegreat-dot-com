const initialState = {
    authenticated: false,
    token: null
}

const authenticationReducer = (state=[initialState], action) => {
    switch(action.type) {
        case 'UPDATE_AUTH':
            state=[];
            return [...state, action.payload];
        default:
            return state;
    }
}

export default authenticationReducer;