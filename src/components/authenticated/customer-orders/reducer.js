const initialState = {
    id: 1,
    name: "Trigve Hagen",
    email: "trigve.hagen@gmail.com",
    address: "",
    city: "",
    state: "",
    zip: "",
    proids: "1_2",
    numofs: "1_2",
    prices: "39.99_39.99"
}

const corderReducer = (state=[initialState], action) => {
    switch(action.type) {
        case "RESET_CORDER":
            return [initialState];
        case "UPDATE_CORDER":
            state=[];
            return [...state, action.payload];
        default:
            return state;
    }
}

export default corderReducer;