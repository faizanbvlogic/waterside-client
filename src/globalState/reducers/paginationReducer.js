const initialState = {
    partnerPage: "",
    vehiclePage: ""
}

const paginationReducer = (state=initialState, action)=>{

    if(action.type === 'setPartnerPreviewPage'){
        return {
            ...state, 
            partnerPage: action.payload?.partnerPage,
        }
    }
    if(action.type === 'setVehiclePreviewPage'){
        return {
            ...state, 
            vehiclePage: action.payload?.vehiclePage,
        }
    }
    else {
        return state
    }
}

export default paginationReducer;