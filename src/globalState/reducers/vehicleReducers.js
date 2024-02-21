const initialState = {
    vehicle: null
}

const vehicleReducer = (state= initialState, action) => {
    if ( action.type === 'setEditVehicle') {
        return {
            ...state,
            vehicle: action.payload
        }
    }
    if (action.type === "setDetailVehicle") {
        return {
            ...state,
            vehicle: action.payload
        }
    }
    else {
        return state
    }
}

export default vehicleReducer 