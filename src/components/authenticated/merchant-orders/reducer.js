const initialState = {
    id: 1,
    date: '2018-10-08 07:49:43',
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

const morderReducer = (state=[initialState], action) => {
    switch(action.type) {
        case "RESET_MORDER":
            return [initialState];
        case "UPDATE_MORDER":
            state=[];
            return [...state, action.payload];
        default:
            return state;
    }
}

export default morderReducer;