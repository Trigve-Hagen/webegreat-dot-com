const initialState = {
    searchString: 'all',
}

const searchReducer = (state=[initialState], action) => {
    switch(action.type) {
        case 'UPDATE_SEARCH':
            state=[];
            return [...state, action.payload];
        default:
            return state;
    }
}

export default searchReducer;