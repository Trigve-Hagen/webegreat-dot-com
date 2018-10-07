const initialState = {
    id: 1,
    menu: "products",
    sku: "AS-1",
    image: "airborne-shirt.png",
    name: "Army Airborne T-Shirt",
    stock: 100,
    ifmanaged: 1,
    price: '39.99',
    description: "Grey t-shirt with Airborne image on front and American flag on sleeve."
}

const productReducer = (state=[initialState], action) => {
    switch(action.type) {
        case "RESET_PRODUCT":
            return [initialState];
        case 'UPDATE_PRODUCT':
            state=[];
            return [...state, action.payload];
        default:
            return state;
    }
}

export default productReducer;