import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import DatePicker from 'react-date-picker';
import moment from 'moment'
import * as api from '../../../../api'
import Button from '../../../../components/bootstrap/Button'
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../../../components/bootstrap/Card'
import Page from '../../../../layout/Page/Page'
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper'
import { setAlert, setLoading } from '../../../../globalState/action-creators'

const EditRatesByPerHour = () => {
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
  const [createSlotCount, setCreateSlotCount] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    defaultPrice: "",
    hours: [
      {
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        price: ""
      }
    ],
    isRecurring: "",
  });
  // Rates data
  const [ratesData, setRatesData] = useState({})

  const [isError, setError] = useState(false)

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
        setCreateSlotCount(_.get(rates, `rates[${index}].hours`, 1)?.length)
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
  console.log(formData)

  const onChange = (e, i, isIndexable) => {
    const ind = i?.index
    const name = !isIndexable?.status ? e?.target?.name : "";
    const value = !isIndexable?.status ? e?.target?.value : "";
    setError(false)
    /**
     * @important "_" WILL USE IN DAYS NAME ONLY
     */
    if (String(isIndexable?.name).includes("_") && isIndexable) {
      const { name } = isIndexable
      let value = e;
      console.log('work')
      const newName = String(name).substring(1)
      let hoursArr = []
      hoursArr = [...ratesData?.hours]
      hoursArr[ind] = {
        ...hoursArr[ind],
        [newName]: value
      }
      ratesData['hours'] = hoursArr
      setRatesData({ ...ratesData })
      let arr = formData
      arr[index] = {
        ...ratesData,
        hours: [
          ...hoursArr
        ]
      }
      setFormData(arr)
    }
    else if (String(name).includes("_")) {
      console.log('work2')
      const newName = String(name).substring(1)
      let hoursArr = []
      hoursArr = [...ratesData?.hours]
      hoursArr[ind] = {
        ...hoursArr[ind],
        [newName]: value
      }
      ratesData['hours'] = hoursArr
      setRatesData({ ...ratesData })
      let arr = formData
      arr[index] = {
        ...ratesData,
        hours: [
          ...hoursArr
        ]
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
      let err;

      if (Object.values(formData[0]?.hours)?.filter(
        (item) => Object.values(item).filter(el => el?.length > 0)?.length < 5 && Object.values(item).filter(el => el?.length > 0)?.length !== 0
      )?.length > 0 || formData[0]?.name?.length <= 0 || formData[0]?.defaultPrice?.length <= 0) {
        err = true
        setError(err)
      }
      if (Object.values(formData[0]?.hours)?.map((hour) => {
        console.log(new Date(hour?.startDate)?.getTime(), " ", new Date(hour?.endDate)?.getTime() )
        if (new Date(hour?.startDate + " " + hour?.startTime)?.getTime() > new Date(hour?.endDate + " " + hour?.endTime)?.getTime()) {
          err = true;
          dispatch(setAlert("End Date & Time must be less than Start Date & Time!", "Error"))
        }
      }))

        if (!err) {
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

  const some = (index) => {
    return <React.Fragment key={index?.index}>
      <div className='card-info-item card-inner edit-dates'>
        <p className=" lable_spacing">Start Date</p>
        <DatePicker
          className='form-control addVehicleSelect input_feild'
          clearIcon={null}
          minDate={new Date()}
          name="_startDate"
          onChange={(e) => onChange(moment(e).format('MM/DD/yyyy'), index, { status: true, name: "_startDate" })}
          format="MM/dd/yyyy"
          value={_.get(ratesData, `hours[${index?.index}].startDate`, "") && _.get(ratesData, `hours[${index?.index}].startDate`, "")?.length > 0 ? new Date(_.get(ratesData, `hours[${index?.index}].startDate`, "")) : ""}
        />
      </div>
      <div className='card-info-item card-inner edit-dates '>
        <p className=" lable_spacing" >End Date</p>
        <DatePicker
          className='form-control addVehicleSelect input_feild'
          clearIcon={null}
          name="_endDate"
          minDate={new Date()}
          onChange={(e) => onChange(moment(e).format('MM/DD/yyyy'), index, { status: true, name: "_endDate" })}
          format="MM/dd/yyyy"
          value={_.get(ratesData, `hours[${index?.index}].endDate`, "") && _.get(ratesData, `hours[${index?.index}].endDate`, "")?.length > 0 ? new Date(_.get(ratesData, `hours[${index?.index}].endDate`, "")) : ""}
        />
      </div>
      <div className='card-info-item card-inner edit-dates'>
        <p className=" lable_spacing">Start Time</p>
        <input
          class="form-control addVehicleSelect editratelable"
          id="startTime"
          type="time"
          required=""
          placeholder="Enter start time..."
          name="_startTime"
          value={_.get(ratesData, `hours[${index?.index}].startTime`, "")}
          onChange={(e) => onChange(e, index)}
        />
      </div>
      <div className='card-info-item card-inner edit-dates'>
        <p className=" lable_spacing">End Time</p>
        <input
          class="form-control addVehicleSelect editratelable"
          id="endTime"
          type="time"
          placeholder="Enter end time..."
          name="_endTime"
          value={_.get(ratesData, `hours[${index?.index}].endTime`, "")}
          onChange={(e) => onChange(e, index)}
        />
      </div>
      <div className='card-info-item card-inner edit-dates' id='last'>
        <div className='edit_rate_addpartner'>
          <p className=" lable_spacing">Rate</p>
          <div className='edit_rate_align'>
            <input type="text"
              className='form-control addVehicleSelect editratelable'
              name='_price'
              value={_.get(ratesData, `hours[${index?.index}].price`, "")}
              onChange={(e) => onChange(e, index)}
            />
            <div className=''>
              {
                createSlotCount > 1 && <Button
                  className="add-partner-btn ic-delete-btn"
                  isLight
                  icon="Delete"
                  color='danger'
                  onClick={() => deleteSlots(index?.index)}>
                </Button>
              }
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  }

  const createSlots = () => {
    if (createSlotCount < 23) {
      setCreateSlotCount(() => createSlotCount + 1)
    }
  }
  const deleteSlots = (ind) => {
    if (createSlotCount > 1) {
      let hoursArr = []
      hoursArr = [...ratesData?.hours]
      hoursArr.splice(ind, 1)
      ratesData['hours'] = hoursArr
      setRatesData({ ...ratesData })
      let arr = formData
      arr[index] = {
        ...ratesData,
        hours: [
          ...hoursArr
        ]
      }
      setFormData(arr)
      setCreateSlotCount(() => createSlotCount - 1)
    }
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
                <div className='create-vehicle-wrapper'>
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
                  <div className='card-info-item card-inner editrates' >
                    <p className='lable_spacing'>Is Reccuring</p>
                    <div className='perhourcheckbox '>
                      <input type="checkbox"
                        id="isRecurring"
                        name="isRecurring"
                        onClick={onChange}
                        checked={isCheck}
                        value={!isCheck}
                        onChange={() => { }}
                        className='reccuring ' />
                      <label for="isRecurring"> Yes/</label>
                      <label for="isRecurring"> No</label>
                    </div>
                  </div>
                </div>
                <div className='btnwrap'>
                  <Button
                    className="mt-3 "
                    isLight
                    icon="Plus"
                    color='primary'
                    onClick={() => createSlots()}>
                    Add Slot
                  </Button>
                </div>
                <div className='create-vehicle-wrapper lable_spacing'>
                  {_.times(createSlotCount, (i) => {
                    return some({ index: i })
                  })}
                  <span className='text-danger'>{isError ? "Please fill out all the fields!" : ""}</span>
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

export default EditRatesByPerHour
