import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_BASE_URL });

API.interceptors.request.use((req) => {
    if (localStorage.getItem('token')) {
        req.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    }

    return req
});

/**
 * @Post
 * @section - authentication
 * @param {
 * email: string
 * password: string
 * } formData 
 * 
 */
export const login = (formData) => API.post('/api/user/login', formData)

/**
 * @section - Dashboard
 * @token - required
 */

export const dashboard = () => API.get('/api/dashboard');

/**
 * @section - Vehicles
 * @token - required
 */
export const getVehicles = (query) => API.get(`/api/vehicle/get${query !== undefined ? '?' + query : ""}`);
export const getVehicleById = (id) => API.get(`/api/vehicle/${id}`);
export const addVehicle = (formData) => API.post('/api/vehicle/create', formData);
export const editVehicle = (id, formData) => API.put(`/api/vehicle/update/${id}`, formData);
export const detailVehicle = (id) => API.get(`/api/vehicle/${id}`);

export const deleteVehicleOnModal = (id) => API.delete(`/api/vehicle/delete/${id}`);
export const getVehiclesByPartner = (data, query) => API.get(`/api/vehicle/vehiclesByPartner/${data.partnerId}${query !== undefined ? '?' + query : ""}`);

/**
 * @section - Renters
 * @token - required
 */

export const addRenters = (formData) => API.post(`/api/renter/create`, formData)
export const getRenterById = (id) => API.get(`/api/renter/${id}`)
export const updateRenter = (id, formData) => API.put(`/api/renter/update/${id}`, formData)
export const getRenters = (query) => API.get(`/api/renter/get${query !== undefined ? '?' + query : ""}`);
export const deleteRenter = (id) => API.delete(`/api/renter/delete/${id}`);


/**
 * @section Rates
 * @token Required
 */

export const getRates = () => API.get('/api/rates/get');
export const getRateById = (id) => API.get(`/api/rates/${id}`);
export const addRate = (formData) => API.post('/api/rates/create', formData)
export const editRate = (id, formData) => API.put(`/api/rates/update/${id}`, formData)
export const deleteRates = (id) => API.delete(`/api/rates/delete/${id}`);

export const getRatesByPartner = (data) => API.get(`/api/rates/retesByPartner/${data.partnerId}`)

/**
 * @section Price
 * @token required
 */
export const getPrice = (id) => API.get(`/api/price/${id}`)
export const addPrice = (formData) => API.post('/api/price/create', formData)
export const defaultPriceUpdate = (id, formData) => API.put(`/api/rates/${id}`, formData)

/**
 * 
 * @section Change rates 
 */
export const getDynamicRatesByPartner = (id) => API.get(`/api/partners_rates/${id}`)
export const editDynaminRatesByPartner = (id, formData) => API.put(`/api/partners_rates/${id}`, formData)

/**
 * @section - Partner
 * @token - required
 */

export const getPartners = (query) => API.get(`/api/partner/get${query !== undefined ? '?' + query : ""}`);
export const addPartner = (formData) => API.post('/api/partner/create', formData);
export const editPartner = (id, formData) => API.put(`/api/partner/update/${id}`, formData);
export const getPartnerById = (id) => API.get(`/api/partner/get/${id}`);
export const deletePartner = (id) => API.delete(`/api/partner/delete/${id}`);
export const sendMailToUser = (data) => API.post(`/api/partner/sendMail`, data)

/**
 * @section Global Search 
 * @token Required
 */

export const search = (query) => API.get(`/api/search?q=${query}`);


/**
 * @section Reservation
 * @token Required
 */

export const getPartnersReservations = (id, query) => API.get(`/api/partner/reservations/${id}${query !== undefined ? '?' + query : ""}`)
export const getAllReservations = (query) => API.get(`/api/reservations${query !== undefined ? '?' + query : ""}`)
export const getAllSucceededPartnersReservations = (query, formData) => API.post(`/api/partner/reservations/revenue${query !== undefined ? '?' + query : ""}`, formData)
export const getAllSucceededReservations = (query, formData) => API.post(`/api/reservations/revenue${query !== undefined ? '?' + query : ""}`, formData)
export const addReservation = (formData) => API.post(`/api/reservation/create`, formData)
export const getReservationById = (id) => API.get(`/api/reservation/${id}`)
export const getRevenueById = (id) => API.get(`/api/revenue/${id}`)
export const updateReservation = (id, formData) => API.put(`/api/reservation/update/${id}`, formData)
export const addNotesInReservation = (id, formData) => API.patch(`/api/reservation/notes/${id}`, formData)
export const deleteReservation = (id) => API.delete(`/api/reservation/${id}`)

/**
 * @section payment
 * @token required
 */

export const createPayment = (formData) => API.post(`/api/payment/create`, formData)

/**
 * @section hold moke
 */
export const holdMoke = (formData) => API.post(`/api/vehicle/hold`, formData)
export const getHoldMoke = (id, query) => API.get(`/api/vehicle/hold/get${(id !== undefined && id?.length > 0) ? `/${id}` : ""}${query !== undefined ? `?${query}` : ""}`)
export const getAllHoldMoke = (id, query) => API.get(`/api/vehicle/hold/all${query !== undefined ? `?${query}` : ""}`)
export const deleteHoldMoke = (id) => API.delete(`/api/vehicle/hold/${id}`)
export const getHoldMokeById = (id) => API.get(`/api/vehicle/getHoldMokeById/${id}`)
export const updateHoldMoke = (formData) => API.put(`/api/vehicle/updateHoldMoke`, formData);


/**
 * @Section Chatbot
 */
export const __getSession = (query) => API.get(`/api/v1/chatbot/session${query !== undefined ? `?fingerPrint=${query}` : ""}`);
export const __addSessionV3 = (fromData) => API.post(`/api/v1/chatbot/session`, fromData);
export const __addSession = (fromData) => API.post(`api/v1/chatbot/vehicles/availability`, fromData);
export const __AddRenter = (formData) => API.post(`api/v1/chatbot/renter/add`, formData);
export const __UpdateRenter = (formData) => API.put(`api/v1/chatbot/renter/update`, formData);
export const __UpdateDriverImages = (id, formData) => API.put(`api/v1/chatbot/renter/${id}`, formData);
export const __UploadFloridaAndSignature = (id, formData) => API.put(`api/v1/chatbot/renter/florida/${id}`, formData);
export const __GetSlotsAndAvailabilityOfMokes = (formData) => API.post(`api/v1/chatbot/slots/available`, formData)

/**
 * @Section AVOID RESERVATION
 */
export const avoidReservation = (id) => API.put(`api/v2/avoid?reservationId=${id}`)
export const markCompleteReservation = (id) => API.put(`api/v2/reservation/complete/${id}`)

/**
 * @Section REFUND BOOKING AMOUNT
 */
export const refund = (id, amount, isAdditionalCharge, formData) => API.post(`/api/v2/refund?reservationId=${id}&amount=${amount}&isAdditionalCharge=${isAdditionalCharge}`, formData)