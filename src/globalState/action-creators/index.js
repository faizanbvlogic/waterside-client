
// -----------------Detail RENTER Action---------------

export const setDetailRenter = (renter) => {
    return (dispatch) => {
        dispatch({
            type: 'setDetailRenter',
            payload: renter
        })
    }
}

// -----------------Alert Actions-----------------

export const setAlert = (message, status) => {
    return (dispatch) => {
        dispatch({
            type: 'setAlert',
            payload: { message, status }
        })
    }
}

export const hideAlert = (message) => {
    return (dispatch) => {
        dispatch({
            type: 'hideAlert',
            payload: { message }
        })
    }
}

// -----------------Loading Actions-----------------

export const setLoading = (loading) => {
    return (dispatch) => {
        dispatch({
            type: 'setLoading',
            payload: loading
        })
    }
}

// for partner preview page
export const setPartnerPreviewPage = (page) => {
    return (dispatch) => {
        dispatch({
            type: 'setPartnerPreviewPage',
            payload: page
        })
    }
}

// for vehicle preview page
export const setVehiclePreviewPage = (page) => {
    return (dispatch) => {
        dispatch({
            type: 'setVehiclePreviewPage',
            payload: page
        })
    }
}

// for user accuont detail
export const setAccount = (user) => {
    return (dispatch) => {
        dispatch({
            type: 'setAccount',
            payload: user
        })
    }
}
