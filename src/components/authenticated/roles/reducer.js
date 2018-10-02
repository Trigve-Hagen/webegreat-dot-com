const initialState = {
    id: 1,
    name: "",
    image: "",
    email: "",
    role: 1,
    address: "",
    city: "",
    state: "",
    zip: "",
    password: "",
}

const roleReducer = (state=[initialState], action) => {
    switch(action.type) {
        case "RESET_ROLE":
            return [initialState];
        case "UPDATE_ROLE":
            state=[];
            return [...state, action.payload];
        default:
            return state;
    }
}

export default roleReducer;