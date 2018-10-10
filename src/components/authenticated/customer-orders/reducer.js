const initialState = {
    transid: 1,
    customer: {
        name: "Trigve Hagen",
        email: "trigve.hagen@gmail.com",
        ifactive: 1,
        role: 3,
        address: "",
        city: "",
        state: "",
        zip: ""
    },
    items: {
        proids: "1_2",
        numofs: "1_2",
        prices: "39.99_39.99"
    }
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