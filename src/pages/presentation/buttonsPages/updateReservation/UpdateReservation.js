import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment-timezone';
import * as api from '../../../../api';
import DatePicker from 'react-date-picker';
import { setAlert, setLoading, setPartnerPreviewPage, setVehiclePreviewPage } from '../../../../globalState/action-creators';
import Select from '../../../../components/bootstrap/forms/Select';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Button from '../../../../components/bootstrap/Button';
import Page from '../../../../layout/Page/Page';
import Card, {
  CardBody,
  CardHeader,
  CardLabel,
  CardTitle,
} from '../../../../components/bootstrap/Card';


const BookMoke = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { id } = useParams();
  const tz = moment.tz.guess();

  const token = localStorage.getItem('token')
  useEffect(() => {
    if (!token) {
      navigate('/auth-pages/login', { replace: true })
    }
    dispatch(setPartnerPreviewPage({ partnerPage: 1 }))
    dispatch(setVehiclePreviewPage({ vehiclePage: 1 }))

    fetchReservation()

    //eslint-disable-next-line
  }, [])

  const [vehicles, setVehicles] = useState([])
  const [reservationData, setReservationData] = useState([])
  console.log(reservationData)

  const [formData, setFormData] = useState({})
  const [renter, setRenter] = useState()
  const [partner, setPartner] = useState()

  const BOOKING_METHOD = [
    { value: "hourly", text: "Per Hour" },
    { value: "daily", text: "Per Day" },
    { value: "weekly", text: "Per Week" },
    { value: "monthly", text: "Per Monthly" }
  ]

  const fetchReservation = async () => {
    dispatch(setLoading(true))
    try {
      const { data } = await api.getReservationById(id);
      if (data?.success) {
        const { partnerId, vehicleId, renterId, bookingMethod, bookingDate, bookingEndDate, bookingTime, bookingEndTime } = data?.reservation;
        setReservationData(data?.reservation)
        fetchVehicles(data?.reservation?.partnerId)
        setRenter([{ value: renterId, text: data?.reservation?.renter?.firstName + " " + data?.reservation?.renter?.lastName }])
        setPartner([{ value: partnerId, text: data?.reservation?.partner?.partnerName }])
        setFormData({
          ...formData,
          partnerId: partnerId,
          vehicleId: vehicleId,
          renterId: renterId,
          bookingMethod: bookingMethod,
          bookingDate: bookingDate,
          bookingEndDate: bookingEndDate,
          bookingTime: bookingTime,
          bookingEndTime: bookingEndTime
        })
      }
    } catch (error) {
      dispatch(setAlert(error?.message, "Error"))
    }
    dispatch(setLoading(false))

  }

  // VEHICLES
  const fetchVehicles = async partnerId => {
    dispatch(setLoading(true));
    try {
      const { data } = await api.getVehiclesByPartner({ partnerId })
      if (data?.success) {
        setVehicles(
          _.get(data, "vehicles", vehicles)?.length > 0 && _.get(data, "vehicles", vehicles)?.map((vehicle) => {
            return { value: vehicle?._id, text: `${vehicle?.vehicleName} ${vehicle?.licensePlates}` }
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


  const updateReservation = async reservationId => {
    dispatch(setLoading(true))
    try {
      const { data } = await api.updateReservation(reservationId, formData);
      if (data?.success) {
        navigate("/reservation", { replace: true });
        dispatch(setAlert(data?.message, "Success"));
      }
      else {
        dispatch(setAlert(data?.message, "Error"))
      }
    }
    catch (error) {
      dispatch(setAlert(error?.message, "Error"))
    }
    dispatch(setLoading(false))
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
                              disabled
                              value={_.get(formData, 'partnerId', '')}
                              list={partner && partner?.length > 0 ? partner : [{ value: "", text: "" }]}
                            />
                          </div>
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
                              value={_.get(formData, "vehicleId", "")?.length > 0 ? _.get(formData, "vehicleId", "") : "Na"}
                              name="vehicleId"
                              list={vehicles?.length > 0 ? vehicles : [{ value: "", text: "" }]}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  vehicleId: e?.target?.value
                                })
                              }
                            />
                          </div>
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
                              disabled
                              value={_.get(formData, "renterId", "")?.length > 0 ? _.get(formData, "renterId", "") : "Na"}
                              name="renterId"
                              list={renter && renter?.length > 0 ? renter : [{ value: "", text: "" }]}
                            />
                          </div>
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
                              disabled
                              value={_.get(formData, "bookingMethod", "")?.length > 0 ? _.get(formData, "bookingMethod", "") : "Na"}
                              list={BOOKING_METHOD}
                            />
                          </div>
                        </div>
                        <div className='card-info-item card-inner card-height'>
                          <p className="editrate-text lable_spacing">Start Date <span className='text-danger fw-bold'>*</span></p>
                          <DatePicker
                            className='form-control addVehicleSelect input_feild'
                            clearIcon={null}
                            name="bookingDate"
                            disabled
                            format="MM/dd/yyyy"
                            value={_.get(formData, `bookingDate`, "") && _.get(formData, `bookingDate`, "")?.length > 0 ? new Date(_.get(formData, `bookingDate`, "")) : ""}
                          />
                        </div>
                        <div className='card-info-item card-inner card-height'>
                          <p className="editrate-text lable_spacing">End Date <span className='text-danger fw-bold'>*</span></p>
                          <DatePicker
                            className='form-control addVehicleSelect input_feild'
                            clearIcon={null}
                            name="bookingEndDate"
                            disabled
                            format="MM/dd/yyyy"
                            value={_.get(formData, `bookingEndDate`, "") && _.get(formData, `bookingEndDate`, "")?.length > 0 ? new Date(_.get(formData, `bookingEndDate`, "")) : ""}
                          />
                        </div>
                        <div className='card-info-item card-inner'>
                          <p className="editrate-text lable_spacing">Start Time <span className='text-danger fw-bold'>*</span></p>
                          <input
                            class="form-control addVehicleSelect editratelable"
                            type="time"
                            required=""
                            value={moment(_.get(formData, 'bookingDate', '')).tz(tz).format("HH:mm")}
                            disabled
                            placeholder="Enter start time..."
                            name="bookingTime"
                          />
                        </div>
                        <div className='card-info-item card-inner'>
                          <p className="editrate-text lable_spacing">End Time <span className='text-danger fw-bold'>*</span></p>
                          <input
                            class="form-control addVehicleSelect editratelable"
                            type="time"
                            placeholder="Enter end time..."
                            name="bookingEndTime"
                            value={moment(_.get(formData, 'bookingEndDate', '')).tz(tz).format("HH:mm")}
                            disabled
                          />
                        </div>
                      </div>
                      <Button
                        className="mt-3 create-reservation"
                        icon="Edit"
                        isLight
                        color='dark'
                        onClick={() => updateReservation(id)}>
                        Update Reservation
                      </Button>
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
