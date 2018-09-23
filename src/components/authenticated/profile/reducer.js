const initialState = {
    avatar: 'user-avatar.jpg' 
}

const avatarReducer = (state=[initialState], action) => {
    switch(action.type) {
        case "RESET_AVATAR":
            return [initialState];
        case "UPDATE_AVATAR":
            state=[];
            return [...state, action.payload];
        default:
            return state;
    }
}

export default avatarReducer;