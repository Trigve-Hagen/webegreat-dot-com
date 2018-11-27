const avatarInitialState = {
    avatar: 'user-avatar.jpg' 
}

const visibilityInitialState = {
    visibility: 0
}

const avatarReducer = (state=[avatarInitialState], action) => {
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

const visibilityReducer = (state=[visibilityInitialState], action) => {
    switch(action.type) {
        case "RESET_VISIBILITY":
            return [initialState];
        case "UPDATE_VISIBILITY":
            state=[];
            return [...state, action.payload];
        default:
            return state;
    }
}

module.exports = {
    avatarReducer,
    visibilityReducer
}