const initialState = {
    renter: null
}

const renterReducer = (state= initialState, action) => {
    if ( action.type === 'setDetailRenter') {
        return {
            ...state,
            renter: action.payload
        }
    }
    else {
        return state
    }
}

export default renterReducer 