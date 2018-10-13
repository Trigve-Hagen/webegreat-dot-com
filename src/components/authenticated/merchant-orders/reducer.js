const initialState = {
    id: 1,
    date: '2018-10-08 07:49:43',
    name: "Trigve Hagen",
    email: "trigve.hagen@gmail.com",
    address: "13066 Paddy Creek Lane",
    city: "Lodi",
    state: "CA",
    zip: "95240",
    proids: "1_2",
    numofs: "1_2",
    prices: "39.99_39.99",
    orderitems: [
        {
            id: 1,
            name: "Army Airborne T-Shirt",
            sku: "WBG-TS1",
            price: "39.99",
            quantity: 1,
            image: "airborne-shirt.png",
            stock: 100,
            total: "39.99"
        }
    ],
    surveyitems: [
        {
            iffront: 0,
            stars: 5,
            comment: "Great site great prices."
        }
    ]
}

const morderReducer = (state=[initialState], action) => {
    switch(action.type) {
        case "RESET_MORDERS":
            return [initialState];
        case "UPDATE_MORDERS":
            state=[];
            return [...state, action.payload];
        default:
            return state;
    }
}

export default morderReducer;