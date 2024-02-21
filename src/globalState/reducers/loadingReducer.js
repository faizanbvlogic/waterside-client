const initialState = {
    isLoading: false
}

const loadingReducer = (state=initialState, action)=>{

    if(action.type === 'setLoading'){

        return {
            ...state, 
            isLoading: action.payload
        }
    }
    else {
        return state
    }
}

export default loadingReducer;