const initialState = {
    id: 1,
    name: "products",
    description: "Base level menu.",
    level: 1,
    parent: "base",
    ifproduct: 1
}

const menuReducer = (state=[initialState], action) => {
    switch(action.type) {
        case "RESET_MENU":
            return [initialState];
        case 'UPDATE_MENU':
            state=[];
            return [...state, action.payload];
        default:
            return state;
    }
}

export default menuReducer;