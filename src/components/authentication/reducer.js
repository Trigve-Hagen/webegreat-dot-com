const authenticationReducer = (state=[], action) => {
    switch(action.type) {
        case 'UPDATE_AUTH':
            state=[];
            return [...state, action.payload];
        default:
            return state;
    }
}

export default authenticationReducer;