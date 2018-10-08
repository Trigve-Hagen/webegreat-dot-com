const initialState = {
    id: 1,
    name: "Trigve Hagen",
    image: "user-avatar.jpg",
    email: "trigve.hagen@gmail.com",
    ifactive: 1,
    role: 3,
    address: "",
    city: "",
    state: "",
    zip: ""
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