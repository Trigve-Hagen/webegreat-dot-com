const navigationReducer = (state=[], action) => {
    switch(action.type) {
        case 'UPDATE_PATH':
            state = []; state[0] = action.payload;
            return [...state];

        default:
            return state;
    }
}

export default navigationReducer;