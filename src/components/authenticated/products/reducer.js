const initialState = {
    id: 0,
    image: 'smile.jpg',
    name: 'Smile',
    price: '0.00',
    description: 'Smiles are free!'
}

const productReducer = (state=[initialState], action) => {
    switch(action.type) {
        case "RESET_APP":
            return [initialState];
        case 'ADD_PRODUCTS':
            return [...state, action.payload];
        case 'UPDATE_PRODUCT':
            state=[];
            return [...state, action.payload];
        default:
            return state;
    }
}

export default productReducer;