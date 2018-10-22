const initialState = {
    currentPage: 1
}

const paginationReducer = (state=[initialState], action) => {
    switch(action.type) {
        case "RESET_PAGINATION":
            return [initialState];
        case "ADD_CURRENT_PAGE":
            state=[];
            return [...state, action.payload];
        default:
            return state;
    }
}

export default paginationReducer;