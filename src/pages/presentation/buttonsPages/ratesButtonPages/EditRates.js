import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import * as api from '../../../../api'
import DatePicker from 'react-date-picker';
import moment from 'moment'
import Button from '../../../../components/bootstrap/Button'
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../../../components/bootstrap/Card'
import Page from '../../../../layout/Page/Page'
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper'
import { setAlert, setLoading } from '../../../../globalState/action-creators'

const EditRates = () => {
  let { id, index } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  useEffect(
    () => {
      if (!token) {
        navigate('/auth-pages/login', { replace: true })
      }
      fetchPartners()

      // eslint-disable-next-line
    }, []
  )
  const [partnersData, setpartnersData] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    defaultPrice: "",
    durationPrice: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    days: {
      Monday: "",
      Tuesday: "",
      Wednesday: "",
      Thursday: "",
      Friday: "",
      Saturday: "",
      Sunday: ""
    },
    isRecurring: "",
    isDefaultRate: ""
  });
  // Rates data
  const [ratesData, setRatesData] = useState([])
  const [isError, setError] = useState(false)
  const [isDaysError, setDaysError] = useState(false)

  const fetchPartners = async () => {
    dispatch(setLoading(true))
    try {
      const { data } = await api.getPartnerById(id)
      if (data?.success) {
        setpartnersData(_.get(data, "partner", { ...formData }))
        fetchRates(id)
      }
      else {
        dispatch(setAlert(data?.message || "Internal server error!", "Error"))
      }
    } catch (error) {
      dispatch(setAlert(error?.message || "Internal server error!", "Error"))
    };
    dispatch(setLoading(false))
  };

  // FETCH DYNAMIC RATES
  const fetchRates = async (id) => {
    try {
      const { data: { rates, success, message } } = await api.getDynamicRatesByPartner(id)
      if (success) {
        setRatesData(_.get(rates, `rates[${index}]`, { ...ratesData }))
        setFormData(_.get(rates, "rates", { ...formData }))
        setIsCheck(_.get(rates, `rates[${index}].isRecurring`, false))
      }
      else {
        dispatch(setAlert(message, "Error"))
      }
    } catch (error) {
      dispatch(setAlert(error.message, "Error"))
    }
  }

  const [isCheck, setIsCheck] = useState(false)
  // for toggle check button
  const toggleCheck = () => {
    if (!isCheck) {
      document.querySelector('.reccuring').classList.add('on');
      setIsCheck(!isCheck)
    }
    else {
      document.querySelector('.reccuring').classList.remove('on')
      setIsCheck(!isCheck)
    }
  }

  const onChange = (e, isIndexable) => {

    const name = !isIndexable?.status ? e?.target?.name : isIndexable?.name
    const value = !isIndexable?.status ? e?.target?.value : e

    console.log(name, value)
    setError(false)
    setDaysError(false)
    /**
     * @important "_" WILL USE IN DAYS NAME ONLY
     */
    if (String(name).includes("_")) {
      const newName = String(name).substring(1)
      setRatesData(
        {
          ...ratesData,
          days: {
            ...ratesData?.days,
            [newName]: value
          }
        }
      )
      let arr = formData
      arr[index] = {
        ...ratesData,
        days: {
          ...ratesData?.days,
          [newName]: value
        }
      }
      setFormData(arr)
    }
    else if (name === "isRecurring") {
      toggleCheck()
      let isRecurring = document.getElementById('isRecurring').getAttribute("value")
      setRatesData({ ...ratesData, isRecurring: isRecurring === "true" ? true : false })
      let arr = formData
      arr[index] = { ...ratesData, isRecurring: isRecurring === "true" ? true : false }
      setFormData(arr)
    }
    else {
      setRatesData(
        {
          ...ratesData,
          [name]: value
        }
      )
      let arr = formData
      arr[index] = {
        ...ratesData,
        [name]: value
      }
      setFormData(arr)
    }
  }

  // EDIT RATE
  const editRate = async () => {
    dispatch(setLoading(true))
    try {
      let error;
      if (_.get(formData[1], "name", "")?.length <= 0) {
        error = true;
        setError(error)
      }
      if (_.get(formData[1], "defaultPrice", "")?.length <= 0) {
        error = true;
        setError(error)
      }
      if (_.get(formData[1]?.days, "Monday", "")?.length <= 0) {
        error = true;
        setDaysError(error)
      }
      if (_.get(formData[1]?.days, "Tuesday", "")?.length <= 0) {
        error = true;
        setDaysError(error)
      }
      if (_.get(formData[1]?.days, "Wednesday", "")?.length <= 0) {
        error = true;
        setDaysError(error)
      }
      if (_.get(formData[1]?.days, "Thursday", "")?.length <= 0) {
        error = true;
        setDaysError(error)
      }
      if (_.get(formData[1]?.days, "Friday", "")?.length <= 0) {
        error = true;
        setDaysError(error)
      }
      if (_.get(formData[1]?.days, "Saturday", "")?.length <= 0) {
        error = true;
        setDaysError(error)
      }
      if (_.get(formData[1]?.days, "Sunday", "")?.length <= 0) {
        error = true;
        setDaysError(error)
      }
      if (new Date(formData[1]?.startDate + " " + formData[1]?.startTime)?.getTime() > new Date(formData[1]?.endDate + " " + formData[1]?.endTime)?.getTime()) {
        error = true;
        dispatch(setAlert("End Date & Time must be less than Start Date & Time!", "Error"))
      }

      if (!error) {
        const { data } = await api.editDynaminRatesByPartner(id, formData);
        if (data?.success) {
          navigate('/change_price', { replace: true })
          dispatch(setAlert(data?.message, "Success"))
        } else {
          dispatch(setAlert(data?.message, "Error"))
        }
      }
    } catch (error) {
      dispatch(setAlert(error.message, "Error"))
    }
    dispatch(setLoading(false))
  }

  return (
    <PageWrapper title="Add Rate">
      <Page container="fluid">
        <div className="row">
          <div className="col-xxl-6">
            <Card stretch>
              <CardHeader>
                <CardLabel icon="Edit" iconColor="dark">
                  <CardTitle tag="h4" className="h5">
                    Edit Rate - {partnersData && _.get(partnersData, "partnerName", "")}
                  </CardTitle>
                </CardLabel>
              </CardHeader>
              <CardBody>
                <div className='create-editrate-wrapper'>
                  <div className='card-info-item card-inner'>
                    <p className=" lable_spacing">Name</p>
                    <input type="text"
                      disabled
                      className='form-control addVehicleSelect editratelable '
                      placeholder='Enter Name'
                      name='name'
                      value={_.get(ratesData, "name", "")}
                      onChange={onChange}
                    />
                  </div>
                  <div className='card-info-item card-inner'>
                    <p className=" lable_spacing">Default Rate</p>
                    <input type="text"
                      className='form-control addVehicleSelect editratelable'
                      placeholder='Enter Default Rate'
                      name='defaultPrice'
                      value={_.get(ratesData, "defaultPrice", "")}
                      onChange={onChange}
                    />
                  </div>
                  {
                    parseInt(index) === 1 &&
                    <React.Fragment>
                      <div className='card-info-item card-inner'>
                        <p className=" lable_spacing">Start Date</p>
                        <DatePicker
                          className='form-control addVehicleSelect input_feild'
                          clearIcon={null}
                          minDate={new Date()}
                          name="startDate"
                          onChange={(e) => onChange(moment(e).format('MM/DD/yyyy'), { status: true, name: "startDate" })}
                          format="MM/dd/yyyy"
                          value={_.get(ratesData, `startDate`, "") && _.get(ratesData, `startDate`, "")?.length > 0 ? new Date(_.get(ratesData, `startDate`, "")) : ""}
                        />
                      </div>
                      <div className='card-info-item card-inner'>
                        <p className=" lable_spacing">End Date</p>
                        <DatePicker
                          className='form-control addVehicleSelect input_feild'
                          clearIcon={null}
                          name="endDate"
                          minDate={new Date()}
                          onChange={(e) => onChange(moment(e).format('MM/DD/yyyy'), { status: true, name: "endDate" })}
                          format="MM/dd/yyyy"
                          value={_.get(ratesData, `endDate`, "") && _.get(ratesData, `endDate`, "")?.length > 0 ? new Date(_.get(ratesData, `endDate`, "")) : ""}
                        />
                      </div>
                      <div className='card-info-item card-inner'>
                        <p className=" lable_spacing">Start Time</p>
                        <input
                          class="form-control addVehicleSelect editratelable"
                          id="startTime"
                          type="time"
                          required=""
                          placeholder="Enter start time..."
                          name="startTime"
                          value={_.get(ratesData, "startTime", "")}
                          onChange={onChange}
                        />
                      </div>
                      <div className='card-info-item card-inner'>
                        <p className=" lable_spacing">End Time</p>
                        <input
                          class="form-control addVehicleSelect editratelable"
                          id="endTime"
                          type="time"
                          placeholder="Enter end time..."
                          name="endTime"
                          value={_.get(ratesData, "endTime", "")}
                          onChange={onChange}
                        />
                      </div>
                      <div className='card-info-item card-inner'>
                        <p>Day</p>
                        <ul className='day_names editday-names'>
                          <li className='select_day'>
                            <div className='activechangerate day_namelist  '>Mon</div>
                            <input type="text"
                              name='_Monday'
                              className='day_text'
                              value={_.get(ratesData, "days.Monday", "")}
                              onChange={onChange}
                            />
                          </li>
                          <li className='select_day'>
                            <div className='day_namelist'>Tue</div>
                            <input type="text"
                              name='_Tuesday'
                              className='day_text'
                              value={_.get(ratesData, "days.Tuesday", "")}
                              onChange={onChange}
                            />
                          </li>
                          <li className='select_day'>
                            <div className='day_namelist'>wed</div>
                            <input type="text" className='day_text'
                              name='_Wednesday'
                              value={_.get(ratesData, "days.Wednesday", "")}
                              onChange={onChange}
                            />
                          </li>
                          <li className='select_day'>
                            <div className='day_namelist'>Thu</div>
                            <input type="text" className='day_text'
                              name='_Thursday'
                              value={_.get(ratesData, "days.Thursday", "")}
                              onChange={onChange}
                            />
                          </li>
                          <li className='select_day'>
                            <div className='day_namelist'>Fri</div>
                            <input type="text" className='day_text'
                              name='_Friday'
                              value={_.get(ratesData, "days.Friday", "")}
                              onChange={onChange}
                            />
                          </li>
                          <li className='select_day'>
                            <div className='day_namelist'>Sat</div>
                            <input type="text" className='day_text'
                              name='_Saturday'
                              value={_.get(ratesData, "days.Saturday", "")}
                              onChange={onChange}
                            />
                          </li>
                          <li className='select_day'>
                            <div className='day_namelist'>Sun</div>
                            <input type="text" className='day_text'
                              name='_Sunday'
                              value={_.get(ratesData, "days.Sunday", "")}
                              onChange={onChange}
                            />
                          </li>
                        </ul>
                      </div>
                      <div className='card-info-item card-inner'>
                        <p className='lable_spacing'>Is Reccuring</p>
                        <input type="checkbox"
                          id="isRecurring"
                          name="isRecurring"
                          onClick={onChange}
                          checked={isCheck}
                          value={!isCheck}
                          className='reccuring' />
                        <label for="isRecurring"> Yes/</label>
                        <label for="isRecurring"> No</label>
                      </div>
                    </React.Fragment>
                  }
                </div>
                <div className='errormsg-box'>
                  <span className='text-danger error-msg'>{(isError || isDaysError) && "Please fill out all the mandatory fields!"}</span>
                </div>
                <Button
                  className="mt-3"
                  color='dark'
                  onClick={() => editRate()}>
                  Update
                </Button>
                <Button
                  className="mt-3 mx-2"
                  color='danger'
                  onClick={() => navigate('/change_price')}>
                  Cancel
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </Page>
    </PageWrapper>
  )
}

export default EditRates
