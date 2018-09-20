const authenticationReducer = (state=[], action) => {
    switch(action.type) {
        case 'UPDATE_AUTH':
            state=[];
            return [...state, action.payload];
        default:
            if(state.legnth < 1) return state=[{ authenticated: false, token: null }];
            else return state;
    }
}

export default authenticationReducer;