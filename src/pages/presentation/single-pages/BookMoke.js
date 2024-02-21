import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import * as api from '../../../api';
import StripeCheckout from 'react-stripe-checkout';
import DatePicker from 'react-date-picker';
import moment from 'moment-timezone';
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';


import { setAlert, setLoading, setPartnerPreviewPage, setVehiclePreviewPage } from '../../../globalState/action-creators';
import Select from '../../../components/bootstrap/forms/Select';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Button from '../../../components/bootstrap/Button';
import Page from '../../../layout/Page/Page';
import Card, {
  CardActions,
  CardBody,
  CardHeader,
  CardLabel,
  CardTitle,
} from '../../../components/bootstrap/Card';


const BookMoke = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = localStorage.getItem('token')
  useEffect(() => {
    if (!token) {
      navigate('/auth-pages/login', { replace: true })
    }
    dispatch(setPartnerPreviewPage({ partnerPage: 1 }))
    dispatch(setVehiclePreviewPage({ vehiclePage: 1 }))
    fetchPartners()

    //eslint-disable-next-line
  }, [])

  const handleToken = async token => {
    dispatch(setLoading(true))
    try {
      const { data } = await api.createPayment({ ...paymentData, currency: "USD", token })
      if (data?.success) {
        dispatch(setAlert(data?.message, "Success"))
        dispatch(setLoading(false))
        navigate('/reservation', { replace: true })
      }
      else {
        dispatch(setLoading(false))
        dispatch(setAlert(data?.message, "Error"))
      }
    } catch (error) {
      dispatch(setLoading(false))
      dispatch(setAlert(error?.message, "Error"))
    }
  }

  const BOOKING_METHOD = [
    { value: "hourly", text: "Per Hour" },
    { value: "daily", text: "Per Day" },
    { value: "weekly", text: "Per Week" },
    // { value: "monthly", text: "Per Monthly" }
  ]

  const [partners, setPartners] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [renters, setRenters] = useState([]);

  // FOR STRIPE EMAIL
  const [renterEmail, setRenterEmail] = useState("")

  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()

  // IS RESERVATION SUCCESS THAN PAYMENT 
  const [isReservationSuccess, setReservationSuccess] = useState(false)
  const [paymentData, setPaymentData] = useState({ reservationId: "", amount: 0 })

  const [formData, setFormData] = useState({
    partnerId: "",
    vehicleId: "",
    renterId: "",
    bookingMethod: "",
    bookingDate: "",
    bookingTime: moment().format("H:mm"),
    bookingEndDate: "",
    bookingEndTime: moment().format("H:mm")
  });
  console.log(formData)

  // FOR ERRORS MESSAGES
  const [partnerError, setPartnerError] = useState(false)
  const [vehicleError, setVehicleError] = useState(false)
  const [renterError, setRenterError] = useState(false)
  const [bookingMethodError, setBookingMethodError] = useState(false)
  const [startDateError, setStartDateError] = useState(false)
  const [startTimeError, setStartTimeError] = useState(false)
  const [endDateError, setEndDateError] = useState(false)
  const [endTimeError, setEndTimeError] = useState(false)

  // HOLD MOKE
  const [holdStartDate, setHoldStartDate] = useState()
  const [holdEndDate, setHoldEndDate] = useState()
  const [holdReason, setHoldReason] = useState('')
  const [isHold, setIsHold] = useState(false)



  const fetchPartners = async () => {
    dispatch(setLoading(true));
    try {
      const [partnersData, rentersData] = await Promise.all([
        api.getPartners(),
        api.getRenters("page=1&size=50")
      ])
      console.log(rentersData?.data)
      if (partnersData?.data?.success && rentersData?.data?.success) {
        setPartners(
          _.get(partnersData?.data, "partners", partners)?.length > 0 && _.get(partnersData?.data, "partners", partners).map((partner) => {
            return { value: partner?._id, text: partner?.partnerName }
          })
        );
        setRenters(
          _.get(rentersData?.data, "renters", renters)?.length > 0 && _.get(rentersData?.data, "renters", renters).map((renter) => {
            return { value: renter?._id, text: renter?.firstName + " " + renter?.lastName, email: renter?.email }
          })
        );
      }
      else {
        if (!partnersData?.data?.success) {
          dispatch(setAlert(partnersData?.data?.message, "Error"))
        }
        else if (!rentersData?.data?.success) {
          dispatch(setAlert(rentersData?.data?.message, "Error"))
        }
      }
    } catch (error) {
      dispatch(setAlert(error?.message, "Error"))
    }
    dispatch(setLoading(false));
  }

  // VEHICLES
  const fetchVehicles = async partnerId => {
    dispatch(setLoading(true));
    try {
      const { data } = await api.getVehiclesByPartner({ partnerId })
      if (data?.success) {
        setVehicles(
          _.get(data, "vehicles", vehicles)?.length > 0 && _.get(data, "vehicles", vehicles)?.map((vehicle) => {
            if (vehicle?.isAvailable === "available") {
              return { value: vehicle?._id, text: `${vehicle?.vehicleName} ${vehicle?.licensePlates}` }
            }
            else {
              return
            }
          })
        );
      }
      else {
        dispatch(setAlert(data?.message, "Error"))
      }
    } catch (error) {
      dispatch(setAlert(error?.message, "Error"))
    }
    dispatch(setLoading(false));
  }

  // CREATE RESERVATION
  const createReservation = async _ => {
    dispatch(setLoading(true));
    try {
      let error = false;
      if (formData?.partnerId?.length <= 0) {
        error = true
        setPartnerError(true)
      }
      if (formData?.vehicleId?.length <= 0) {
        error = true
        setVehicleError(true)
      }
      if (formData?.renterId?.length <= 0) {
        error = true
        setRenterError(true)
      }
      if (formData?.bookingMethod?.length <= 0) {
        error = true
        setBookingMethodError(true)
      }
      if (formData?.bookingDate?.length <= 0) {
        error = true
        setStartDateError(true)
      }
      if (formData?.bookingTime?.length <= 0) {
        error = true
        setStartTimeError(true)
      }
      if (formData?.bookingEndDate?.length <= 0) {
        error = true
        setEndDateError(true)
      }
      if (formData?.bookingEndTime?.length <= 0) {
        error = true
        setEndTimeError(true)
      }
      if (formData?.bookingTime?.length > 0 && formData?.bookingEndTime?.length > 0 && formData?.bookingMethod !== "daily" && formData?.bookingMethod !== "weekly" && formData?.bookingMethod !== "monthly") {
        const startTime = moment(formData?.bookingTime, "HH:mm")
        console.log(startTime)
        const timeDiffForEndTime = moment(formData?.bookingEndTime, "HH:mm").diff(startTime, 'minutes')
        console.log(timeDiffForEndTime)
        if (timeDiffForEndTime < 60 && formData?.bookingMethod === "hourly") {
          dispatch(setAlert('You cannot select less than one hour', "Warning"))
          error = true
        }
      }
      if (formData?.bookingDate?.length > 0 && formData?.bookingEndDate?.length > 0 && formData?.bookingMethod === "weekly") {
        const startDate = new Date(formData?.bookingDate).getTime()
        const endDate = new Date(formData?.bookingEndDate).getTime()
        const timeDiffInDays = ((endDate - startDate) / (1000 * 3600 * 24)) + 1;
        if (timeDiffInDays < 7) {
          dispatch(setAlert("You cann't select less than 7 days for weekly reservation!", "Warning"))
          error = true
        }
        // const convert_to_seven_days = timeDiffInDays / 7
        // const how_many_week_for_charge = Math.ceil(timeDiffInDays / 7)
        // if (convert_to_seven_days < how_many_week_for_charge) {
        //   dispatch(setAlert(`You haven't selected in 7 days order, you will be charged for ${how_many_week_for_charge} weeks!`, "dark"))
        // }
      }

      if (!error) {
        const { data } = await api.addReservation({
          ...formData,
          bookingDate: new Date(moment(
            new Date(formData?.bookingDate + " " + formData?.bookingTime).toISOString()
          ).tz("America/New_York")?.format()).toISOString(),
          bookingEndDate: new Date(moment(
            new Date(formData?.bookingEndDate + " " + formData?.bookingEndTime).toISOString()
          ).tz("America/New_York")?.format()).toISOString(),
          bookingTime: new Date(moment(
            new Date(formData?.bookingDate + " " + formData?.bookingTime).toISOString()
          ).tz("America/New_York")?.format()).toISOString(),
          bookingEndTime: new Date(moment(
            new Date(formData?.bookingEndDate + " " + formData?.bookingEndTime).toISOString()
          ).tz("America/New_York")?.format()).toISOString()
        });
        if (data?.success) {
          setReservationSuccess(!isReservationSuccess)
          setPaymentData({
            ...paymentData,
            reservationId: data?.reservationId || "",
            amount: parseFloat(data?.subTotal).toFixed(2)
          })
        }
        else {
          dispatch(setAlert(data?.message, "Error"))
        }
      }
    } catch (error) {
      dispatch(setAlert(error?.message, "Error"))
    }
    dispatch(setLoading(false));
  }

  const fetchHoldMoke = async (e, name, vehicleId) => {
    let sDate;
    let eDate;
    console.log(vehicleId)
    try {
      if (name === "startDate" && endDate) {
        if (name === "startDate" && formData?.bookingMethod === "hourly") {
          sDate = e
          eDate = e
        }
        else {
          console.log("1")
          sDate = e
          eDate = endDate
        }
      }
      else if (name === "endDate" && startDate) {
        console.log("2")
        sDate = startDate
        eDate = e
      }
      else if (name === "hourly") {
        console.log("3")
        sDate = e
        eDate = e
      }
      else if (name === "minEndDate") {
        console.log("minEndDate")
        sDate = e
        eDate = e
      }
      if ((startDate && name === "endDate") || (endDate && name === "startDate") || (name === "hourly") || (name === "minEndDate")) {
        console.log("4")
        console.log(sDate)
        console.log(eDate)
        const { data } = await api.getHoldMoke(_.get(formData, "vehicleId", ""), `startDate=${new Date(sDate).toISOString()}&endDate=${new Date(eDate).toISOString()}`)
        if (data?.success) {
          if (data?.vehicles && data?.vehicles?.length > 0) {
            setIsHold(true)
            setHoldStartDate(_.get(data, "vehicles[0].hold.startDate", ""))
            setHoldEndDate(_.get(data, "vehicles[0].hold.endDate", ""))
            setHoldReason(_.get(data, "vehicles[0].hold.reason", ""))
          }
          else {
            setIsHold(false)
          }
        }
      }

      else if (vehicleId && startDate && endDate) {
        const { data } = await api.getHoldMoke(vehicleId, `startDate=${new Date(startDate).toISOString()}&endDate=${new Date(endDate).toISOString()}`)
        if (data?.success) {
          if (data?.vehicles && data?.vehicles?.length > 0) {
            setIsHold(true)
            setHoldStartDate(_.get(data, "vehicles[0].hold.startDate", ""))
            setHoldEndDate(_.get(data, "vehicles[0].hold.endDate", ""))
            setHoldReason(_.get(data, "vehicles[0].hold.reason", ""))
          }
          else {
            setIsHold(false)
          }
        }
      }

    } catch (error) {
      console.log(error)
    }
  }

  const onChange = (e, isIndexable) => {
    const name = !isIndexable?.status ? e?.target?.name : isIndexable?.name
    const value = !isIndexable?.status ? e?.target?.value : e
    name === "partnerId" && setPartnerError(false)
    if (name === "vehicleId") {
      setVehicleError(false)
      fetchHoldMoke("", "", value)
    }
    if (name === "renterId") {
      setRenterError(false)
      setRenterEmail(e?.target?.selectedOptions[0]?.getAttribute('email'))
    }
    name === "bookingMethod" && setBookingMethodError(false)
    name === "bookingDate" && setStartDateError(false)
    name === "bookingTime" && setStartTimeError(false)
    name === "bookingEndDate" && setEndDateError(false)
    name === "bookingEndTime" && setEndTimeError(false)

    if (name === "bookingMethod" && value === "weekly") {
      console.log('work')
      let copyData = _.cloneDeep(formData)
      copyData.bookingTime = "00:00"
      copyData.bookingEndTime = "23:59"
      copyData.bookingDate = ""
      copyData.bookingEndDate = ""
      copyData.bookingMethod = value
      setFormData(copyData);
    }

    if ((name === "bookingDate" || name === "bookingEndDate" ||
      (formData?.bookingDate && name === "bookingEndDate") ||
      (formData?.bookingEndDate && name === "bookingDate"))
      && formData?.bookingMethod === "weekly") {
      const startDate = name === "bookingDate" ? new Date(value).getTime() : new Date(formData?.bookingDate).getTime()
      const endDate = name === "bookingEndDate" ? new Date(value).getTime() : (new Date(formData?.bookingEndDate).getTime() + (1000 * 60 * 1))
      console.log("endDate " + new Date(endDate))
      const timeDiffInDays = ((endDate - startDate) / (1000 * 3600 * 24)) + 1;
      const convert_to_seven_days = timeDiffInDays / 7
      console.log(timeDiffInDays, " <<<<<<<<<<<<<<<<<<<")
      const how_many_week_for_charge = Math.ceil(timeDiffInDays / 7)
      console.log(convert_to_seven_days, how_many_week_for_charge, timeDiffInDays > 7, "<<<<<<<<<>>>>>>>>")
      if (timeDiffInDays < 7) {
        dispatch(setAlert("You cann't select less than 7 days for weekly reservation!", "Error"))
      }
      else if (convert_to_seven_days < how_many_week_for_charge) {
        dispatch(setAlert(`You haven't selected in 7 days order, you will be charged for ${how_many_week_for_charge} weeks!`, "Dark"))
      }
    }

    if (name === "bookingDate" && formData.bookingEndDate && new Date(value)?.getTime() >= new Date(formData?.bookingEndDate)?.getTime()) {
      fetchHoldMoke(value, "minEndDate")
    }

    if (name === 'bookingDate' && formData.bookingMethod && formData.bookingMethod === 'hourly') {
      let copyData = _.cloneDeep(formData)
      copyData.bookingDate = value
      copyData.bookingEndDate = value
      setIsHold(false)
      fetchHoldMoke(value, "hourly")
      setFormData(copyData);
      endDateError && setEndDateError(false)
    }
    else if (value === 'hourly') {
      let copyData = _.cloneDeep(formData)
      copyData.bookingDate = ""
      copyData.bookingTime = moment().format("H:mm")
      copyData.bookingEndDate = ""
      copyData.bookingEndTime = ""
      copyData.bookingMethod = value
      setFormData(copyData);
      setIsHold(false)
    }
    else if (value === 'daily') {
      let copyData = _.cloneDeep(formData)
      copyData.bookingDate = ""
      copyData.bookingEndDate = ""
      copyData.bookingMethod = value
      setFormData(copyData);
      setIsHold(false)
    }
    else if (name === "bookingMethod" && value === "weekly") {
      let copyData = _.cloneDeep(formData)
      copyData.bookingTime = "00:00"
      copyData.bookingEndTime = "23:59"
      copyData.bookingDate = ""
      copyData.bookingEndDate = ""
      copyData.bookingMethod = value
      setFormData(copyData);
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
  }
  const onChangeStartTime = (e) => {
    const name = e?.target?.name
    const value = e?.target?.value
    let currentTime = moment().format("H:mm")
    currentTime = moment(currentTime, "HH:mm")
    const selectedTime = moment(value, "HH:mm")
    const timeDiff = currentTime.diff(selectedTime, 'minutes')
    const startDate = moment(_.get(formData, 'bookingDate', '')).format("DD-MM-YYYY")
    const currentDate = moment().format("DD-MM-YYYY")

    console.log(name === 'bookingTime' && formData.bookingMethod && formData.bookingMethod === 'daily')
    if (name === 'bookingTime' && formData.bookingMethod && formData.bookingMethod === 'daily') {
      console.log("work")
      console.log(endTimeError)
      endTimeError && setEndTimeError(false)
    }

    const dayDiff = (startDate === currentDate)
    if ((timeDiff > 0 && dayDiff)) {
      dispatch(setAlert('This time has been passed you cannot select the time', "Error"))
    } else {
      if (name === 'bookingTime') {
        if (formData.bookingMethod === 'daily' || formData?.bookingMethod === "weekly") {
          setFormData({ ...formData, bookingEndTime: value, [name]: value });
        }
        else {
          setFormData({ ...formData, [name]: value });
        }
      } else {
        const startTime = moment(_.get(formData, 'bookingTime', '00:00'), "HH:mm")
        const timeDiffForEndTime = selectedTime.diff(startTime, 'minutes')
        if (timeDiffForEndTime < 60 && formData?.bookingMethod === "hourly") {
          dispatch(setAlert('You cannot select less than one hour', "Warning"))
        }
        else {
          setFormData({ ...formData, [name]: value });
        }
      }
    }

  }


  return (
    <>
      <PageWrapper title={"Book Moke"}>
        <Page container='fluid'>
          <div className="row">
            <div className="col-xxl-6">
              <Card stretch className="book-moke-card">
                <CardHeader>
                  <CardLabel icon='BookMoke' iconColor="dark">
                    <CardTitle tag='h4' className='h5'>
                      Book Moke
                    </CardTitle>
                  </CardLabel>
                </CardHeader>
                <CardBody className='table-responsive align-center'>
                  {
                    <>
                      <div className='create-vehicle-wrapper vehicle-wrapper align_table'>
                        <div className="card-info-item card-inner">
                          <div className="label">
                            <p class="editrate-text lable_spacing">Partner <span class="text-danger fw-bold">*</span></p>
                          </div>
                          <div className="data">
                            <Select
                              ariaLabel='Default select example'
                              className="addVehicleSelect inputBoxShadow"
                              placeholder=' '
                              name="partnerId"
                              list={partners?.length > 0 ? partners : [{ value: "", text: "" }]}
                              onChange={(e) => {
                                onChange(e)
                                fetchVehicles(e?.target?.value)
                              }}
                            />
                          </div>
                          <span className='text-danger danger-msg'>{partnerError ? "Please select a partner!" : ''}</span>
                        </div>
                        <div className="card-info-item card-inner">
                          <div className="label">
                            <p class="editrate-text lable_spacing">Vehicle <span class="text-danger fw-bold">*</span></p>
                          </div>
                          <div className="data">
                            <Select
                              ariaLabel='Default select example'
                              className="addVehicleSelect inputBoxShadow"
                              placeholder=' '
                              name="vehicleId"
                              list={vehicles?.length > 0 ? vehicles : [{ value: "", text: "" }]}
                              onChange={onChange}
                            />
                          </div>
                          <span className='text-danger danger-msg'>{vehicleError ? "Please select a vehicle!" : ''}</span>
                        </div>
                        <div className="card-info-item card-inner card-height">
                          <div className="label">
                            <p class="editrate-text lable_spacing">Renter<span class="text-danger fw-bold">*</span></p>
                          </div>
                          <div className="data">
                            <Select
                              ariaLabel='Default select example'
                              className="addVehicleSelect inputBoxShadow"
                              placeholder=' '
                              id="renterId"
                              name="renterId"
                              list={renters?.length > 0 ? renters : [{ value: "", text: "" }]}
                              onChange={onChange}
                            />
                          </div>
                          <span className='text-danger danger-msg'>{renterError ? "Please select a renter!" : ''}</span>
                        </div>
                        <div className="card-info-item card-inner card-height">
                          <div className="label">
                            <p class="editrate-text lable_spacing">Booking Period <span class="text-danger fw-bold">*</span></p>
                          </div>
                          <div className="data">
                            <Select
                              ariaLabel='Default select example'
                              className="addVehicleSelect inputBoxShadow"
                              placeholder=' '
                              name="bookingMethod"
                              list={BOOKING_METHOD}
                              onChange={onChange}
                            />
                          </div>
                          <span className='text-danger danger-msg'>{bookingMethodError ? "Please select a booking period!" : ''}</span>
                        </div>
                        <div className='card-info-item card-inner card-height'>
                          <p className="editrate-text lable_spacing">Start Date <span className='text-danger fw-bold'>*</span></p>
                          <DatePicker
                            className='form-control addVehicleSelect input_feild'
                            clearIcon={null}
                            name="bookingDate"
                            minDate={new Date()}
                            onChange={(e) => {
                              setStartDate(new Date(e).toISOString())
                              fetchHoldMoke(e, "startDate")
                              onChange(moment(e).format('MM/DD/YYYY'), { status: true, name: "bookingDate" })
                            }}
                            format="MM/dd/yyyy"
                            value={_.get(formData, `bookingDate`, "") && _.get(formData, `bookingDate`, "")?.length > 0 ? new Date(_.get(formData, `bookingDate`, "")) : ""}
                          />

                          <span className='text-danger danger-msg'>{startDateError ? "Please select a start date!" : ''}</span>
                        </div>
                        <div className='card-info-item card-inner card-height'>
                          <p className="editrate-text lable_spacing">End Date <span className='text-danger fw-bold'>*</span></p>
                          <DatePicker
                            className='form-control addVehicleSelect input_feild'
                            clearIcon={null}
                            name="bookingEndDate"
                            disabled={_.get(formData, 'bookingMethod', '') === 'hourly' || _.get(formData, "vehicleId", "")?.length <= 0}
                            minDate={_.get(formData, `bookingDate`, "")?.length > 0 ? new Date(_.get(formData, `bookingDate`, "")) : new Date()}
                            onChange={(e) => {
                              setEndDate(new Date(e).toISOString())
                              fetchHoldMoke(e, "endDate")
                              onChange(moment(e).format('MM/DD/YYYY'), { status: true, name: "bookingEndDate" })
                            }}
                            format="MM/dd/yyyy"
                            value={_.get(formData, `bookingEndDate`, "") && _.get(formData, `bookingEndDate`, "")?.length > 0 ? new Date(_.get(formData, `bookingEndDate`, "")) : ""}
                          />
                          <span className='text-danger danger-msg'>{endDateError ? "Please select a end date!" : ''}</span>
                        </div>
                        <div className='card-info-item card-inner'>
                          <p className="editrate-text lable_spacing">Start Time <span className='text-danger fw-bold'>*</span></p>
                          <input
                            class="form-control addVehicleSelect editratelable"
                            type="time"
                            required=""
                            value={_.get(formData, 'bookingTime', '00:00')}
                            // disabled={_.get(formData, 'bookingMethod', '') === 'weekly'}
                            placeholder="Enter start time..."
                            name="bookingTime"
                            onChange={onChangeStartTime}
                          />
                          <span className='text-danger danger-msg'>{startTimeError ? "Please select a start time!" : ''}</span>
                        </div>
                        <div className='card-info-item card-inner'>
                          <p className="editrate-text lable_spacing">End Time <span className='text-danger fw-bold'>*</span></p>
                          <input
                            class="form-control addVehicleSelect editratelable"
                            type="time"
                            placeholder="Enter end time..."
                            name="bookingEndTime"
                            value={_.get(formData, 'bookingEndTime', '00:00')}
                            disabled={_.get(formData, 'bookingMethod', '') === 'daily' || _.get(formData, 'bookingMethod', '') === 'weekly'}
                            onChange={onChangeStartTime}
                          />
                          <span className='text-danger danger-msg'>{endTimeError ? "Please select a end time!" : ''}</span>
                        </div>
                      </div>
                      <div className='col-lg-12 hold-due-error'> <span className='text-danger danger-msg'>{isHold ? `Moke is on hold ${holdReason && holdReason?.length > 0 ? `due to ${holdReason}` : ""} (${moment(holdStartDate).format("MM/DD/YYYY")} to ${moment(holdEndDate).format("MM/DD/YYYY")})` : ''}</span></div>
                      <Button
                        className="mt-3 create-reservation"
                        disabled={isHold}
                        icon="Plus"
                        isLight
                        color='dark'
                        onClick={() => createReservation()}>
                        Create Reservation
                      </Button>
                    </>
                  }
                  {
                    isReservationSuccess &&
                    <>
                      <div className={`modalContainer paymentPopup ${isReservationSuccess ? 'show' : ''}`}
                        onClick={async () => {
                          await api.deleteReservation(paymentData?.reservationId)
                          setReservationSuccess(false)
                        }}>
                        <div className="modalContent paymentPopupContent pay-with-card"
                          onClick={(e) => {
                            e.stopPropagation()
                          }}>
                          {/* stopPropagation : - //if you click inside the content, it will stop at .modal-content and the onClick in .modal will never be called */}
                          <div className="modalBody mx-3">

                            <div className='cross_icon_circle'> <span className='cross_icon' style={{ cursor: "pointer", color: "black" }} onClick={
                              async () => {
                                await api.deleteReservation(paymentData?.reservationId)
                                setReservationSuccess(false)
                              }
                            }>&#10005;</span></div>

                            <StripeCheckout
                              className="popup"
                              stripeKey={process.env.REACT_APP_STRIPE_KEY}
                              token={handleToken}
                              name="WeMoke"
                              panelLabel={`Pay`}
                              currency='USD'
                              amount={Math.ceil(paymentData?.amount * 100)}
                              locale="en"
                              email={renterEmail ? renterEmail : ""}
                            >
                            </StripeCheckout>


                          </div>
                        </div>
                      </div>
                    </>
                  }
                </CardBody>
              </Card>
            </div>
          </div>
        </Page>
      </PageWrapper>

    </>
  )
}

export default BookMoke
