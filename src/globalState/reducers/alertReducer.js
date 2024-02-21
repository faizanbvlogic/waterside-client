const initialState = {
    message: "",
    status: ""
}

const alertReducer = (state=initialState, action)=>{

    if(action.type === 'setAlert'){

        return {
            ...state, 
            message: action.payload.message,
            status: action.payload.status
        }
    }
    if(action.type === 'hideAlert'){

        return {
            ...state, 
            message: "",
            status: ""
        }
    }
    else {
        return state
    }
}

export default alertReducer;