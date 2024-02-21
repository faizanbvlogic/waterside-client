const initialState = {
    email: "",
    role: ""
}

const userReducer = (state=initialState, action)=>{

    if(action.type === 'setAccount'){

        return {
            ...state, 
            email: action.payload?.email,
            role: action.payload?.role,
            id: action.payload?._id
        }
    }
    else {
        return state
    }
}

export default userReducer;