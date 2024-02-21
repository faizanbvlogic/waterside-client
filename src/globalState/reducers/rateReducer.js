const initialState = {
    rate: null
}

const rateReducer = (state= initialState, action) => {
    if ( action.type === 'setEditRate') {
        return {
            ...state,
            rate: action.payload
        }
    }
    if (action.type === "setDetailRate") {
        return {
            ...state,
            rate: action.payload
        }
    }
    else {
        return state
    }
}

export default rateReducer 