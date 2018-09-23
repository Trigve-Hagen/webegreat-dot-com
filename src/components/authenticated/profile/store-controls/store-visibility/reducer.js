const initialState = {
    visibility: 0
}

const visibilityReducer = (state=[initialState], action) => {
    switch(action.type) {
        case "RESET_VISIBILITY":
            return [initialState];
        case "UPDATE_VISIBILITY":
            state=[];
            return [...state, action.payload];
        default:
            return state;
    }
}

export default visibilityReducer;