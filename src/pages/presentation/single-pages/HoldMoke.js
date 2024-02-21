import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import DatePicker from 'react-date-picker';
import Select from '../../../components/bootstrap/forms/Select';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Button from '../../../components/bootstrap/Button';
import Page from '../../../layout/Page/Page';
import * as api from '../../../api';
import _ from 'lodash';
import Card, {
  CardBody,
  CardHeader,
  CardLabel,
  CardTitle,
} from '../../../components/bootstrap/Card';
import { setAlert, setLoading, setPartnerPreviewPage, setVehiclePreviewPage } from '../../../globalState/action-creators';

const AddHoldMoke = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = localStorage.getItem('token')
  useEffect(() => {
    if (!token) {
      navigate('/auth-pages/login', { replace: true })
    }
    dispatch(setPartnerPreviewPage({ partnerPage: 1 }))
    dispatch(setVehiclePreviewPage({ vehiclePage: 1 }))
    fetchVehicles()
    //eslint-disable-next-line
  }, [])


  const [formData, setFormData] = useState({
    vehicleId: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    reason: "",
    isHold: true
  })
  console.log(formData)
  const [vehicles, setVehicles] = useState([])

  const [isEndDateError, setIsEndDateError] = useState(false)

  // VEHICLES
  const fetchVehicles = async () => {
    dispatch(setLoading(true));
    try {
      const { data } = await api.getVehicles()
      if (data?.success) {
        const optionArray = []
        _.get(data, 'vehicles', []).map((vehicle, i) => {
          optionArray.push({ value: vehicle?._id, text: `${vehicle?.vehicleName} ${vehicle?.licensePlates}` })
          return null
        })
        setVehicles(optionArray)
      }
      else {
        dispatch(setAlert(data?.message, "Error"))
      }
    } catch (error) {
      dispatch(setAlert(error?.message, "Error"))
    }
    dispatch(setLoading(false));
  }

  // THIS IS FOR GPS TESTING AFTER TESTING DELETE THIS FETCHGPSSTATUS FUNCTION
  // const fetchGpsStatus = async () => {
  //   try {
  //     const options = {
  //       method: 'GET',
  //     };
  //     const imei = 868239051537319;
  //     const reservationId = "62b99e4d99fb60595628e188"
  //     const gpsInterval = setInterval((async () => {
  //       const response = await fetch(`http://localhost:5000/api/gps/devices_status/${imei}/${reservationId}`, options)
  //       const data = await response.json() 
  //       if(data?.success){
  //         if(data?.mokeIn){
  //           clearInterval(gpsInterval)
  //           console.log("clear interval")
  //           console.log(data)
  //         }
  //         else {
  //           console.log(data)
  //         }
  //       }else {
  //         console.log("something went wrong!")
  //       }
  //     }), 3000)

  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const onChange = (e, isIndexable) => {
    const name = !isIndexable?.status ? e?.target?.name : isIndexable?.name
    const value = !isIndexable?.status ? e?.target?.value : e
    setIsEndDateError(false)
    setFormData({ ...formData, [name]: value });
  }

  const createHold = async () => {
    dispatch(setLoading(true))
    try {
      let error;
      if (new Date(moment(new Date(formData?.startDate))?.format("MM/DD/YYYY") + " " + formData?.startTime).getTime() > new Date(moment(new Date(formData?.endDate))?.format("MM/DD/YYYY") + " " + formData?.endTime).getTime()) {
        error = true;
        setIsEndDateError(true)
      }
      if(new Date(moment(new Date(formData?.startDate))?.format("MM/DD/YYYY") + " " + formData?.startTime).getTime() <= new Date()?.getTime()){
        error = true;
        dispatch(setAlert("Start date must be greater than current date!", "Error"))
      }
      if (!error) {
        let Obj = {
          vehicleId: formData?.vehicleId,
          startDate: moment(new Date(moment(formData?.startDate)?.format("MM/DD/YYYY") + " " + formData?.startTime)?.toISOString())?.toISOString(),
          endDate: moment(new Date(moment(formData?.endDate)?.format("MM/DD/YYYY") + " " + formData?.endTime)?.toISOString())?.toISOString(),
          reason: formData?.reason,
          isHold: formData?.isHold
        }
        const { data } = await api.holdMoke(Obj)
        if (data?.success) {
          console.log(data)
          navigate('/hold_moke')
        }
        else {
          dispatch(setAlert(data?.message, "Error"))
        }
      }

    } catch (error) {
      dispatch(setAlert(error.message, "Error"))
    }
    dispatch(setLoading(false))
  }

  return (
    <>
      <PageWrapper title={"Book Moke"}>
        <Page container='fluid'>
          <div className="row">
            <div className="col-xxl-6">
              <Card stretch>
                <CardHeader>
                  <CardLabel icon='HoldMoke' iconColor="dark">
                    <CardTitle tag='h4' className='h5'>
                      Hold Moke
                    </CardTitle>
                  </CardLabel>
                </CardHeader>
                <CardBody className='table-responsive'>
                  <div className='create-vehicle-wrapper vehicle-wrapper'>
                    <div className="card-info-item card-inner">
                      <div className="label">
                        <p className='create-partner-text moke-text lable_spacing'>
                          Moke <span className='text-danger fw-bold'>*</span>
                        </p>
                      </div>
                      <div className="data">
                        <Select
                          ariaLabel='Default select example'
                          className="addVehicleSelect inputBoxShadow"
                          placeholder=' '
                          name="vehicleId"
                          list={vehicles && vehicles?.length > 0 ? vehicles : [{ value: "select moke", text: "select Moke" }]}
                          onChange={onChange}
                        />
                      </div>
                      {/* <span className='text-danger danger-msg'>{partnerError ? "Please select a partner!" : ''}</span> */}
                    </div>
                    <div className='card-info-item card-inner'>
                      <p className="editrate-text lable_spacing">Start Date <span className='text-danger fw-bold'>*</span></p>
                      <DatePicker
                        className='form-control addVehicleSelect input_feild'
                        clearIcon={null}
                        minDate={new Date()}
                        name="startDate"
                        onChange={(e) => onChange(new Date(e).toISOString(), { status: true, name: "startDate" })}
                        format="MM/dd/yyyy"
                        value={_.get(formData, `startDate`, "") && _.get(formData, `startDate`, "")?.length > 0 ? new Date(_.get(formData, `startDate`, "")) : ""}
                      />

                      {/* <span className='text-danger danger-msg'>{startDateError ? "Please select a start date!" : ''}</span> */}
                    </div>
                    <div className='card-info-item card-inner'>
                      <p className="editrate-text lable_spacing">Start Time <span className='text-danger fw-bold'>*</span></p>
                      <input
                        class="form-control addVehicleSelect editratelable"
                        type="time"
                        required=""
                        value={_.get(formData, 'startTime', '00:00')}
                        // disabled={_.get(formData, 'bookingMethod', '') === 'weekly'}
                        placeholder="Enter start time..."
                        name="startTime"
                        onChange={(e) => setFormData({ ...formData, startTime: e?.target?.value })}
                      />
                    </div>
                    <div className='card-info-item card-inner'>
                      <p className="editrate-text lable_spacing">End Date <span className='text-danger fw-bold'>*</span></p>
                      <DatePicker
                        className='form-control addVehicleSelect input_feild'
                        clearIcon={null}
                        minDate={new Date()}
                        name="endDate"
                        onChange={(e) => onChange(new Date(
                          moment(new Date(e).toISOString()).format("MM/DD/YYYY") + " " + "11:59").toISOString(),
                          { status: true, name: "endDate" })}
                        format="MM/dd/yyyy"
                        value={_.get(formData, `endDate`, "") && _.get(formData, `endDate`, "")?.length > 0 ? new Date(_.get(formData, `endDate`, "")) : ""}
                      />
                      {/* <span className='text-danger danger-msg'>{endDateError ? "Please select a end date!" : ''}</span> */}
                    </div>
                    <div className='card-info-item card-inner'>
                      <p className="editrate-text lable_spacing">End Time <span className='text-danger fw-bold'>*</span></p>
                      <input
                        class="form-control addVehicleSelect editratelable"
                        type="time"
                        required=""
                        value={_.get(formData, 'endTime', '00:00')}
                        // disabled={_.get(formData, 'bookingMethod', '') === 'weekly'}
                        placeholder="Enter start time..."
                        name="endTime"
                        onChange={(e) => setFormData({ ...formData, endTime: e?.target?.value })}
                      />
                    </div>
                    <div className="card-info-item card-inner">
                      <div className="label">
                        <p className="editrate-text lable_spacing">Reason</p>
                      </div>
                      <div className="data data_inner" >
                        <textarea
                          className='form-control addVehicleSelect textarea_inner'
                          autoComplete='off'
                          onChange={(e) => onChange(e)}
                          name="reason"
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    className="mt-3 add-hold"
                    icon="Plus"
                    isLight
                    color='dark'
                    onClick={() => createHold()}
                  >
                    Add Hold
                  </Button>
                  <span className='text-danger danger-msg'>{isEndDateError ? "End Date must be greater than Start Date!" : ''}</span>
                </CardBody>
              </Card>
            </div>
          </div>
        </Page>
      </PageWrapper>

      {/* <button onClick={fetchGpsStatus}>Fetch </button> */}
    </>
  )
}

export default AddHoldMoke