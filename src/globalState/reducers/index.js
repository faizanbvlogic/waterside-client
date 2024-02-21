import { combineReducers } from 'redux';
import vehicleReducer from './vehicleReducers';
import renterReducer from './renterReducers'
import rateReducer from './rateReducer'
import alertReducer from './alertReducer'
import loadingReducer from './loadingReducer'
import paginationReducer from './paginationReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
    alert: alertReducer,
    loading: loadingReducer,
    vehicle: vehicleReducer,
    renter: renterReducer,
    rate: rateReducer,
    previousPage: paginationReducer,
    user: userReducer
});

export default rootReducer;