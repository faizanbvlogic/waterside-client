import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
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

const EditHoldMoke = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { id } = useParams();

  const token = localStorage.getItem('token')
  useEffect(() => {
    if (!token) {
      navigate('/auth-pages/login', { replace: true })
    }
    dispatch(setPartnerPreviewPage({ partnerPage: 1 }))
    dispatch(setVehiclePreviewPage({ vehiclePage: 1 }))
    fetchVehicles()
    fetchMoke()
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

  const fetchMoke = async () => {
    dispatch(setLoading(true))
    try {

      const { data } = await api.getHoldMokeById(id)
      if (data.success) {
        const moke = data?.moke
        setFormData({
          ...formData,
          _id: _.get(moke, '_id', ''),
          vehicleId: _.get(moke, 'vehicleId', ''),
          startDate: _.get(moke, 'startDate', ''),
          endDate: _.get(moke, 'endDate', ''),
          startTime: moment(_.get(moke, 'startDate', ''))?.format("HH:mm"),
          endTime: moment(_.get(moke, 'endDate', ''))?.format("HH:mm"),
          reason: _.get(moke, 'reason', ''),
        })
      }
      else {
        dispatch(setAlert(data.message, "Error"))
      }
    } catch (error) {
      dispatch(
        setAlert(
          error.message,
          "Error"
        )
      )
    }
    dispatch(setLoading(false))
  }


  const onChange = (e, isIndexable) => {
    const name = !isIndexable?.status ? e?.target?.name : isIndexable?.name
    const value = !isIndexable?.status ? e?.target?.value : e
    setIsEndDateError(false)
    setFormData({ ...formData, [name]: value });
  }

  const updateHold = async () => {
    dispatch(setLoading(true))
    try {
      let error;
      if (new Date(moment(new Date(formData?.startDate))?.format("MM/DD/YYYY") + " " + "00:00").getTime() > new Date(moment(new Date(formData?.endDate))?.format("MM/DD/YYYY") + " " + "00:00").getTime() ) {
        error = true;
        setIsEndDateError(true)
      }
      if(new Date(moment(new Date(formData?.startDate))?.format("MM/DD/YYYY") + " " + formData?.startTime).getTime() <= new Date()?.getTime()){
        error = true;
        dispatch(setAlert("Start date must be greater than current date!", "Error"))
      }
      if (!error) {
        let Obj = {
          _id: formData?._id,
          vehicleId: formData?.vehicleId,
          reason: formData?.reason,
          isHold: formData?.isHold,
          startDate: moment(new Date(moment(formData?.startDate)?.format("MM/DD/YYYY") + " " + formData?.startTime)?.toISOString())?.toISOString(),
          endDate: moment(new Date(moment(formData?.endDate)?.format("MM/DD/YYYY") + " " + formData?.endTime)?.toISOString())?.toISOString(),
        }
        const { data } = await api.updateHoldMoke(Obj)
        if (data?.success) {
          navigate('/hold_moke')
        }
        else {
          dispatch(setAlert(data?.message, "Success"))
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
                          disabled={true}
                          value={_.get(formData, 'vehicleId', '')}
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
                        name="bookingDate"
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
                          moment(new Date(e).toISOString()).format("MM/DD/YYYY") + " " + "11:59").toISOString(), { status: true, name: "endDate" })}
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
                        <p className='mx-3 lable_spacing'>
                          Reason
                        </p>
                      </div>
                      <div className="data data_inner" >
                        <textarea
                          className='form-control addVehicleSelect textarea_inner'
                          autoComplete='off'
                          onChange={(e) => onChange(e)}
                          name="reason"
                          value={_.get(formData, `reason`, "")}
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    className="mx-2 mt-3"
                    color='dark'
                    onClick={updateHold}
                  >
                    Update
                  </Button>
                  <Button
                    className="mt-3"
                    color='danger'
                    // isLight
                    // icon='PublishedWithChanges'
                    onClick={() => navigate('/hold_moke')}>
                    Cancel
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

export default EditHoldMoke
