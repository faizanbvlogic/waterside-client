import React, { useEffect, useState } from 'react'
import InputMask from "react-text-mask"
import { useNavigate, useParams } from 'react-router-dom'
import _ from "lodash"
import tzlookup from "tz-lookup";
import { useDispatch } from 'react-redux'
import { US_STATES } from '../../../constants'
import Select from '../../../components/bootstrap/forms/Select';
import * as api from '../../../api'
import Button from '../../../components/bootstrap/Button';
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/bootstrap/Card';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { setAlert, setLoading } from '../../../globalState/action-creators';


import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';

const phoneNumberMask = [
  "(",
  /[1-9]/,
  /\d/,
  /\d/,
  ")",
  " ",
  /\d/,
  /\d/,
  /\d/,
  "-",
  /\d/,
  /\d/,
  /\d/,
  /\d/
]
const countries = [
  // { value: '', text: 'Select' },
  { value: 'US', text: 'US' }
]
const surchargeType = [
  { value: 'Daily', text: 'Daily' },
  { value: 'Percentage', text: 'Percentage' }
]


const AddPartner = () => {
  let { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = localStorage.getItem('token')
  useEffect(
    () => {
      if (!token) {
        navigate('/auth-pages/login', { replace: true })
      }
      fetchPartner();
      // eslint-disable-next-line
    }, []
  )

  const [createSlotCount, setCreateSlotCount] = useState(1)
  const [isPartnerNameError, setPartnerNameError] = useState(false)
  const [isContactNumberError, setContactNumberError] = useState({ error: false, index: null })
  const [isEmailError, setEmailError] = useState({ error: false, index: null })
  const [isUserEmailError, setUserEmailError] = useState(false)
  const [isUserPasswordError, setUserPasswordError] = useState(false)
  const [isContactPersonNameError, setContactPersonNameError] = useState({ error: false, index: null })
  const [isAddressError, setAddressError] = useState(false)
  const [isCityError, setCityError] = useState(false)
  const [isZipCodeError, setZipCodeError] = useState(false)
  const [formData, setFormData] = useState(
    {
      partner: {
        partnerName: "",
        contactPersonName: [],
        contactNumber: [],
        email: [],
        address: "",
        country: "US",
        surcharge: "",
        surchargeType: "",
        stateTax: "",
        countyTax: "",
        city: "",
        state: "",
        zipcode: "",
        isEmailSend: [],
        partnerEmail: "",
        partnerPassword: "",
        location: ""
      },
      user: {
        partnerEmail: "",
        partnerPassword: "",
        role: "partner",
        partnerId: id,
      }
    });


  const [emailData, setEmailData] = useState([])
  const [isEmailSendData, setEmailSendData] = useState([])
  const [contactPersonNameData, setContactPersonNameData] = useState([])
  const [contactNumberData, setContactNumberData] = useState([])

  const [location, setLocation] = useState({})

  const [value, setValue] = useState("");
  const [isCheck, setIsCheck] = useState([])
  console.log(formData)
  // for toggle check button
  const toggleCheck = (i) => {
    if (!isCheck[i]) {
      document.querySelector(`.isEmailSend${i}`).classList.add('on');
      let arr = [...isCheck];
      console.log(arr)
      arr[i] = true
      setIsCheck(arr)
    }
    else {
      document.querySelector(`.isEmailSend${i}`).classList.remove('on')
      let arr = [...isCheck];
      console.log(arr)
      arr[i] = false
      setIsCheck(arr)
    }
  }


  const cutDecimals = (name, number) => {
    let value = number?.indexOf('.') !== -1 ? number?.split('.')[0] + "." + number?.split('.')[1]?.substring(0, 5) : number
    setFormData({
      ...formData,
      partner: {
        ...formData?.partner,
        [name]: value
      },
      user: { ...formData?.user }
    })
  }


  const formatPhoneNumber = (phoneNumberString) => {
    const cleaned = ('' + phoneNumberString?.toString())?.replace(/\D/g, '')
    let match = ''
    if (phoneNumberString?.toString()?.length === 10) {
      match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
      return { contactNumber: match?.length > 0 && '(' + match[1] + ') ' + match[2] + '-' + match[3] }
    }
    return null
  }

  const onChange = (e, i, section) => {
    const { name, value } = e.target;
    if (String(name).includes("_")) {
      const newName = String(name).substring(1)
      if (name === '_email') {
        setEmailError({ error: false, index: i })
        let emailArr = [];
        emailArr = [...emailData]
        emailArr[i] = {
          ...emailArr[i],
          [newName]: value
        }
        setEmailData(emailArr)
        setFormData({
          ...formData,
          partner: {
            ...formData?.partner,
            email: emailArr
          },
          user: { ...formData?.user }
        })
      }
      if (name === '_contactNumber') {
        setContactNumberError({ error: false, index: i })
        let contactNumberArr = [];
        contactNumberArr = [...contactNumberData]
        contactNumberArr[i] = {
          ...contactNumberArr[i],
          [newName]: value
        }
        setContactNumberData(contactNumberArr)
        setFormData({
          ...formData,
          partner: {
            ...formData?.partner,
            contactNumber: contactNumberArr
          },
          user: { ...formData?.user }
        })
      }
      if (name === '_contactPersonName') {
        setContactPersonNameError({ error: false, index: i })
        let contactPersonNameArr = [];
        contactPersonNameArr = [...contactPersonNameData]
        contactPersonNameArr[i] = {
          ...contactPersonNameArr[i],
          [newName]: value
        }
        setContactPersonNameData(contactPersonNameArr)
        setFormData({
          ...formData,
          partner: {
            ...formData?.partner,
            contactPersonName: contactPersonNameArr
          },
          user: { ...formData?.user }
        })
      }
    }
    else if (name === "isEmailSend") {
      console.log(i)
      toggleCheck(i)
      let isEmailSend = document.getElementById(`isEmailSend${i}`).getAttribute("value")
      console.log(isEmailSend)
      // let emailArr = [];
      let isEmailSendArr = [];
      isEmailSendArr = [...isEmailSendData]
      isEmailSendArr[i] = String(isEmailSend) === "true" ? true : false
      console.log(">>>>>", isEmailSendArr)
      setEmailSendData(isEmailSendArr)
      setFormData({
        ...formData,
        partner: {
          ...formData?.partner,
          isEmailSend: isEmailSendArr
        },
        user: { ...formData?.user }
      })
    }
    else if (name === "surcharge" || name === "stateTax" || name === "countyTax") {
      cutDecimals(name, value)
    }
    else {
      if (name === 'partnerName') {
        setPartnerNameError(false)
      }
      // if (name === 'email') {
      //   setEmailError(false)
      // }
      // if (name === 'contactNumber') {
      //   setContactNumberError(false)
      // }
      // if (name === 'contactPersonName') {
      //   setContactPersonNameError(false)
      // }
      if (name === 'address') {
        setAddressError(false)
      }
      if (name === 'city') {
        setCityError(false)
      }
      if (name === 'zipcode') {
        setZipCodeError(false)
      }
      if (name === 'partnerEmail') {
        setUserEmailError(false)
      }
      if (name === 'partnerPassword') {
        setUserPasswordError(false)
      }
      if (name === 'notes') {
        setFormData({
          ...formData,
          partner: {
            ...formData?.partner,
            [name]: value
          }
        })
      }
      if (section === "partner") {
        setFormData({
          ...formData,
          partner: {
            ...formData?.partner,
            [name]: value
          },
          user: { ...formData?.user }
        })
      }
      if (section === "user") {
        setFormData({
          ...formData,
          partner: { ...formData?.partner },
          user: {
            ...formData?.user,
            [name]: value
          }
        })
      }
    }
  };

  const fetchPartner = async () => {
    dispatch(setLoading(true))
    try {
      const { data } = await api.getPartnerById(id)
      if (data?.success) {
        const parsedData = _.get(data, "partner", { ...formData?.partner })
        setEmailData(_.get(parsedData, "email", { ...emailData }))
        setContactPersonNameData(_.get(parsedData, "contactPersonName", { ...contactPersonNameData }))
        const contactNumber = _.get(data, "partner.contactNumber", "")?.length > 0 && _.get(data, "partner.contactNumber", "")?.map((e, index) => formatPhoneNumber(e?.contactNumber))
        setContactNumberData(contactNumber)
        setFormData({
          ...formData,
          partner: {
            ...parsedData,
            contactNumber
          },
          user: {
            ...formData?.user,
            ...data?.user
          }
        })
        setValue(_.get(parsedData, "address", ""));
        let arrForFindMaxValueOfContact = [_.get(data, `partner.email`, 1)?.length, _.get(data, `partner.contactNumber`, 1)?.length, _.get(data, `partner.contactPersonName`, 1)?.length]
        let shortArr = arrForFindMaxValueOfContact?.sort((a, b) => a - b)
        let max = shortArr[arrForFindMaxValueOfContact?.length - 1]
        setCreateSlotCount(max > 0 ? max : 1)
        setIsCheck(_.get(parsedData, 'isEmailSend', []))
        setEmailSendData(_.get(parsedData, 'isEmailSend', []))
      }
      else {
        dispatch(setAlert(data?.message, "Error"))
      }
    } catch (error) {
      dispatch(
        setAlert(
          error?.message,
          "Error"
        )
      )
    }
    dispatch(setLoading(false))
  }

  const updatePartner = async () => {
    dispatch(setLoading(true))
    try {
      const reWord = /^[A-Za-z _]+$/;
      const reDigit = /^[0-9]*$/;
      const regAddress = /^[a-zA-Z0-9\s,.'-]{3,}$/;
      // const regNote = /^[a-zA-Z0-9\s,.'-/!]{3,100}$/;
      //eslint-disable-next-line
      const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      let error = false
      if (_.get(formData?.partner, 'partnerName', '')?.length <= 0) {
        error = true
        setPartnerNameError(true)
      }
      if (_.get(formData?.partner, 'contactNumber', '').length > 0 && _.get(formData?.partner, 'contactNumber', '')?.filter((e) => e?.contactNumber && e?.contactNumber?.length > 0 && e?.contactNumber?.replace(/[^\d]/g, "").length < 10)?.length > 0) {
        error = true
        _.get(formData?.partner, 'contactNumber', '').length > 0 && _.get(formData?.partner, 'contactNumber', '')?.filter((e, index) => e?.contactNumber && e?.contactNumber?.length > 0 && e?.contactNumber?.replace(/[^\d]/g, "").length < 10 && setContactNumberError({ error: true, index }))

      }
      if (_.get(formData?.partner, 'contactPersonName', '').length > 0 && _.get(formData?.partner, 'contactPersonName', '')?.filter((e) => e?.contactPersonName && e?.contactPersonName?.length > 0 && !reWord.test(_.get(e, 'contactPersonName', '')))?.length > 0) {
        error = true
        _.get(formData?.partner, 'contactPersonName', '').length > 0 && _.get(formData?.partner, 'contactPersonName', '')?.filter((e, index) => e?.contactPersonName && e?.contactPersonName?.length > 0 && !reWord.test(_.get(e, 'contactPersonName', '')) && setContactPersonNameError({ error: true, index }))

      }
      // if (!reWord.test(String(_.get(formData, 'city', '')))) {
      //   error = true
      //   setCityError(true)
      // }
      // if (!regAddress.test(String(_.get(formData, 'address', '')).toLowerCase())) {
      //   error = true
      //   setAddressError(true)
      // }
      if (_.get(formData?.partner, 'address', '')?.length <= 0) {
        error = true
        setAddressError(true)
      }
      // if (_.get(formData, 'zipcode', '')?.length < 5 || _.get(formData, 'zipcode', '')?.length > 6 || !reDigit.test(_.get(formData, "zipcode", ""))) {
      //   error = true
      //   setZipCodeError(true)
      // }
      if (_.get(formData?.partner, 'email', '').length > 0 && _.get(formData?.partner, 'email', '')?.filter((e) => e?.email && e?.email?.length > 0 && !regex.test(_.get(e, 'email', '')))?.length > 0) {
        error = true
        _.get(formData?.partner, 'email', '').length > 0 && _.get(formData?.partner, 'email', '')?.filter((e, index) => e?.email && e?.email?.length > 0 && !regex.test(_.get(e, 'email', '')) && setEmailError({ error: true, index }))

      }
      formData.partner.contactNumber = _.get(formData?.partner, 'contactNumber', '').length > 0 && _.get(formData?.partner, 'contactNumber', '')?.map((e) => { return e?.contactNumber && e?.contactNumber?.length > 0 && { contactNumber: e?.contactNumber?.replace(/[^\d]/g, "") } })

      if (!error) {
        const { data } = await api.editPartner(id, formData);
        if (data?.success) {
          navigate('/partners')
          dispatch(
            setAlert(
              data?.message,
              "Success"
            )
          )
        }
        else {
          dispatch(
            setAlert(
              data?.message,
              "Error"
            )
          )
        }
      }

    } catch (error) {
      dispatch(
        setAlert(
          error?.message,
          "Error"
        )
      )
    }
    dispatch(setLoading(false))
  }

  const createSlot = (index) => {
    return <React.Fragment key={index?.index}>
      <div className="card-info-item card-inner">
        <div className="label">
          <p className='mx-3 lable_spacing'>
            Contact person name
          </p>
        </div>
        <div className="data">
          <input type="text"
            className='form-control addVehicleSelect'
            autoComplete='off'
            value={_.get(formData?.partner, `contactPersonName[${index?.index}].contactPersonName`, "")}
            onChange={(e) => onChange(e, index?.index)}
            name="_contactPersonName"
            style={styles?.inputStyles} />
        </div>
        <span className='text-danger danger-msg'>{(isContactPersonNameError?.error && isContactPersonNameError?.index === index?.index) ? "Please enter valid contact person name!" : ''}</span>
      </div>
      <div className="card-info-item card-inner">
        <div className="label">
          <p className='mx-3 lable_spacing'>
            Contact person email
          </p>
        </div>
        <div className="data">
          <input type="email"
            id='email'
            className='form-control addVehicleSelect'
            autoComplete='off'
            value={_.get(formData?.partner, `email[${index?.index}].email`, "")}
            onChange={(e) => onChange(e, index?.index)}
            name="_email"
            style={styles?.inputStyles} />
        </div>
        <span className='text-danger danger-msg'>{(isEmailError?.error && isEmailError?.index === index?.index) ? "Please enter valid email" : ''}</span>
      </div>
      <div className="card-info-item card-inner">
        <div className="label">
          <p className='mx-3 lable_spacing'>
            Contact number
          </p>
        </div>
        <div className="data">
          <div className='delete-contact-input'>
            <InputMask
              guide={false}
              type="text"
              value={_.get(formData?.partner, `contactNumber[${index?.index}].contactNumber`, "")}
              // keepCharPositions={false}
              mask={phoneNumberMask}
              className="form-control addVehicleSelect delete_form_input"
              name="_contactNumber"
              onChange={(e) => onChange(e, index?.index)}
              style={styles.inputStyles}
            />
            {
              createSlotCount > 1 && <Button
                className="ic-btn-delete delete_btn_addpartner"
                isLight
                icon="Delete"
                color='danger'
                onClick={() => deleteSlots(index?.index)}>
              </Button>
            }
            {/* {
              <input type="checkbox"
                id={`isEmailSend${index?.index}`}
                name="isEmailSend"
                onClick={(e) => onChange(e, index?.index)}
                checked={isCheck[index?.index] ? true : false}
                value={isCheck[index?.index] ? false : true}
                className={`checkbox isEmailSend${index?.index}`} />
            }  */}

          </div>
          <span className='text-danger danger-msg'>{(isContactNumberError?.error && isContactNumberError?.index === index?.index) ? "Please enter valid 10 digit contact number!" : ''}</span>
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
      let emailArr = []
      let contactNumberArr = [];
      let contactPersonNameArr = [];
      emailArr = [...emailData]
      contactNumberArr = [...contactNumberData]
      contactPersonNameArr = [...contactPersonNameData]
      emailArr.splice(ind, 1)
      contactNumberArr.splice(ind, 1)
      contactPersonNameArr.splice(ind, 1)
      setEmailData(emailArr)
      setContactNumberData(contactNumberArr)
      setContactPersonNameData(contactPersonNameArr)
      setFormData({
        ...formData,
        partner: {
          ...formData?.partner,
          email: emailArr,
          contactNumber: contactNumberArr,
          contactPersonName: contactPersonNameArr
        },
        user: { ...formData?.user }
      })
      setCreateSlotCount(() => createSlotCount - 1)
    }
  }

  const sendEmail = async () => {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let error = false
    if (_.get(formData?.partner, 'partnerName', '')?.length <= 0) {
      error = true
      setPartnerNameError(true)
    }
    if (_.get(formData?.partner, 'address', '')?.length <= 0) {
      error = true
      setAddressError(true)
    }
    if (_.get(formData?.user, 'partnerEmail', '')?.length <= 0) {
      error = true
      setUserEmailError(true)
    }
    if (_.get(formData?.user, 'partnerEmail', '').length > 0 && !regex.test(_.get(formData?.user, 'partnerEmail', ''))) {
      error = true
      setUserEmailError(true)
    }

    if (_.get(formData?.user, 'partnerPassword', '')?.length <= 0) {
      error = true
      setUserPasswordError(true)
    }
    if (!error) {
      const obj = {
        email: _.get(formData?.user, 'partnerEmail', ''),
        password: _.get(formData?.user, 'partnerPassword', '')
      }
      const { data } = await api.sendMailToUser(obj);
      if (data?.success) {
        dispatch(setAlert(data?.message, "Success"))
      } else {
        dispatch(setAlert(data?.message, "Error"))
      }
    }

  }

  return (
    <PageWrapper title="Add vehicle">
      <Page container='fluid'>
        <div className="row">
          <div className="col-xxl-6">
            <Card stretch>
              <CardHeader>
                <CardTitle tag="h4" className="h5">
                  Edit Partner
                </CardTitle>

              </CardHeader>
              {/* <hr /> */}
              <CardBody>
                <div className="row">
                  <div className='create_vehicle_inner'>
                    {/* <div className='mx-2'>
                            <p><strong className='create-vehicle-heading'>Vehicle Features</strong></p>
                        </div> */}
                    <div className='create-vehicle-wrapper vehicle-wrapper add_partner_wrapper'>
                      <div className="card-info-item card-inner">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            Partner name <span className='text-danger fw-bold'>*</span>
                          </p>
                        </div>
                        <div className="data">
                          <input type="text"
                            className='form-control addVehicleSelect'
                            value={_.get(formData?.partner, 'partnerName', '')}
                            autoComplete='off'
                            onChange={(e) => onChange(e, "", "partner")}
                            name="partnerName"
                            style={styles?.inputStyles} />
                        </div>
                        <span className='text-danger danger-msg'>{isPartnerNameError ? "Please enter valid partner name!" : ''}</span>
                      </div>
                      <div className="card-info-item card-inner">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            Address <span className='text-danger fw-bold'>*</span>
                          </p>
                        </div>
                        <div className="data addressinput address-partner"
                          onFocus={() => setAddressError(false)}>
                          {value && value?.length > 0 &&
                            <GooglePlacesAutocomplete

                              apiKey={process.env.REACT_APP_GOOGLE_ADDRESS_API_KEY}
                              apiOptions={{ language: 'en', region: 'us' }}
                              autocompletionRequest={{
                                componentRestrictions: {
                                  country: ["us"], //to set the specific country
                                },
                              }}
                              selectProps={{
                                defaultInputValue: value,
                                isClearable: true,
                                onChange: (e) => {
                                  console.log(e?.label)
                                  setValue(e?.label)
                                  e?.label && e?.label?.length > 0 && geocodeByAddress(e?.label)
                                    .then(results => getLatLng(results[0]))
                                    .then(({ lat, lng }) => {
                                      console.log('Successfully got latitude and longitude', { lat, lng })
                                      setFormData({
                                        ...formData,
                                        partner: {
                                          ...formData?.partner,
                                          address: e?.label,
                                          state: e?.value?.terms[e?.value?.terms?.length - 2]?.value,
                                          city: e?.value?.terms[e?.value?.terms?.length - 3]?.value,
                                          location: {lat, lng},
                                          timeZone: tzlookup(lat, lng)
                                        },
                                        user: { ...formData?.user }
                                      })
                                    }
                                    );
                                  // setFormData({
                                  //   ...formData,
                                  //   partner: {
                                  //     ...formData?.partner,
                                  //     address: e?.label,
                                  //     state: e?.value?.terms[e?.value?.terms?.length - 2]?.value,
                                  //     city: e?.value?.terms[e?.value?.terms?.length - 3]?.value,
                                  //     location
                                  //   },
                                  //   user: { ...formData?.user }
                                  // })
                                }
                              }}
                              onLoadFailed={(error) => {
                                console.log(error);
                              }}
                            />
                          }
                          {(!value || value === undefined || value?.length <= 0) &&
                            <GooglePlacesAutocomplete
                              apiKey={process.env.REACT_APP_GOOGLE_ADDRESS_API_KEY}
                              apiOptions={{ language: 'en', region: 'us' }}
                              autocompletionRequest={{
                                componentRestrictions: {
                                  country: ["us"], //to set the specific country
                                },
                              }}
                              selectProps={{
                                isClearable: true,
                                onChange: (e) => {
                                  setValue(e?.label)
                                  e?.label && e?.label?.length > 0 && geocodeByAddress(e?.label)
                                    .then(results => getLatLng(results[0]))
                                    .then(({ lat, lng }) => {
                                      console.log("timeZone", tzlookup(lat, lng))
                                      console.log('Successfully got latitude and longitude', { lat, lng })
                                      setFormData({
                                        ...formData,
                                        partner: {
                                          ...formData?.partner,
                                          address: e?.label,
                                          state: e?.label?.split(',')?.length >= 4 ? e?.label?.split(',')[e?.label?.split(',')?.length - 2] : e?.label?.split(',')[e?.label?.split(',')?.length - 1],
                                          city: e?.label?.split(',')?.length >= 4 ? e?.label?.split(',')[e?.label?.split(',')?.length - 3] : e?.label?.split(',')[e?.label?.split(',')?.length - 2],
                                          // state: e?.value?.terms[e?.value?.terms?.length - 2]?.value,
                                          // city: e?.value?.terms[e?.value?.terms?.length - 3]?.value,
                                          location: {lat, lng}
                                        },
                                        user: { ...formData?.user }
                                      })
                                    }
                                    );
                                  // setFormData({
                                  //   ...formData,
                                  //   partner: {
                                  //     ...formData?.partner,
                                  //     address: e?.label,
                                  //     state: e?.value?.terms[e?.value?.terms?.length - 2]?.value,
                                  //     city: e?.value?.terms[e?.value?.terms?.length - 3]?.value,
                                  //   },
                                  //   user: { ...formData?.user }
                                  // })
                                }
                              }}
                              onLoadFailed={(error) => {
                                console.log(error);
                              }}
                            />
                          }
                        </div>
                        <span className='text-danger danger-msg'>{isAddressError ? "Please enter valid Address!" : ''}</span>
                      </div>
                      <div className="card-info-item card-inner">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            City
                          </p>
                        </div>
                        <div className="data">
                          <input type="text"
                            className='form-control addVehicleSelect'
                            value={_.get(formData?.partner, 'city', '')}
                            autoComplete='off'
                            onChange={(e) => onChange(e, _, "partner")}
                            name="city"
                            style={styles?.inputStyles} />
                        </div>
                        <span className='text-danger danger-msg'>{isCityError ? "Please enter valid city name!" : ''}</span>
                      </div>
                      <div className="card-info-item card-inner">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            State
                          </p>
                        </div>
                        <div className="data">
                          <Select
                            ariaLabel='Default select example'
                            placeholder=' '
                            value={_.get(formData?.partner, 'state', '')}
                            // style={styles.inputBoxShadow}
                            style={{ boxShadow: 'rgb(116 116 116 / 53%) 0px 0px 1px 1px inset' }}
                            id="state"
                            name="state"
                            onChange={(e) => onChange(e, _, "partner")}
                            list={US_STATES}
                            className="addVehicleSelect inputBoxShadow"
                          />

                        </div>
                      </div>
                      <div className="card-info-item card-inner">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            Zip Code
                          </p>
                        </div>
                        <div className="data">
                          <input type="text"
                            value={_.get(formData?.partner, 'zipcode', '')}
                            className='form-control addVehicleSelect'
                            autoComplete='off'
                            onChange={(e) => onChange(e, _, "partner")}
                            name="zipcode"
                            style={styles?.inputStyles} />
                        </div>
                        <span className='text-danger danger-msg'>{isZipCodeError ? "Please enter valid zip code!" : ''}</span>
                      </div>
                      <div className="card-info-item card-inner">
                        <div className="label">
                          <p className='mx-3 lable_spacing' >
                            Country
                          </p>
                        </div>
                        <div className="data">
                          <Select
                            ariaLabel='Default select example'
                            placeholder=' '
                            value={_.get(formData?.partner, 'country', '')}
                            // style={styles.inputBoxShadow}
                            style={{ boxShadow: 'rgb(116 116 116 / 53%) 0px 0px 1px 1px inset' }}
                            id="country"
                            name="country"
                            onChange={(e) => onChange(e, _, "partner")}
                            list={countries}
                            className="addVehicleSelect inputBoxShadow"
                          />
                        </div>
                      </div>
                      <div className="card-info-item card-inner">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            Email
                          </p>
                        </div>
                        <div className="data">
                          <input
                            type="text"
                            value={_.get(formData?.user, "partnerEmail", "")}
                            className='form-control addVehicleSelect'
                            autoComplete='off'
                            onChange={(e) => onChange(e, _, "user")}
                            name="partnerEmail"
                            style={styles?.inputStyles}
                          />
                        </div>
                        <span className='text-danger danger-msg'>{isUserEmailError ? "Please enter valid Email !" : ''}</span>
                      </div>
                      <div className="card-info-item card-inner">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            Password
                          </p>
                        </div>
                        <div className="data">
                          <input
                            type="text"
                            value={_.get(formData?.user, "partnerPassword", "")}
                            className='form-control addVehicleSelect'
                            autoComplete='off'
                            onChange={(e) => onChange(e, _, "user")}
                            name="partnerPassword"
                            style={styles?.inputStyles}
                          />
                          <span className='text-danger danger-msg'>{isUserPasswordError ? "Please enter password!" : ''}</span>
                        </div>
                      </div>
                      <Button
                        className="mt-3 send-email-btn"
                        isLight
                        color='primary'
                        onClick={() => sendEmail()}>
                        Send Email
                      </Button>
                    </div>
                    <div className='btnwrap'>
                      <Button
                        className="mt-3 "
                        isLight
                        icon="Plus"
                        color='primary'
                        onClick={() => createSlots()}>
                        Add Contact
                      </Button>
                    </div>
                    <div className='create-vehicle-wrapper vehicle-wrapper'>
                      {_.times(createSlotCount, (i) => {
                        return createSlot({ index: i })
                      })}
                      <div className="card-info-item card-inner">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            Surcharge
                          </p>
                        </div>
                        <div className="surcharge_box">
                          <input
                            // guide={false}
                            type="text"
                            value={_.get(formData?.partner, 'surcharge', '')}
                            // keepCharPositions={false}
                            // mask={surchargeMask}
                            className='number_field addVehicleSelect'
                            autoComplete='off'
                            onChange={(e) => onChange(e, _, "partner")}
                            name="surcharge"
                            style={styles?.inputStyles} />
                          <hr className='surcharge-seprator'></hr>
                          <Select
                            ariaLabel='Default select example'
                            placeholder=' '
                            style={{ boxShadow: 'rgb(116 116 116 / 53%) 0px 0px 1px 1px inset' }}
                            id="surchargeType"
                            value={formData?.partner?.surchargeType}
                            name="surchargeType"
                            onChange={(e) => onChange(e, _, "partner")}
                            list={surchargeType}
                            className='dropdown_field surcharge_daily'
                          />

                        </div>
                      </div>
                      <div className="card-info-item card-inner">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            State Tax
                          </p>
                        </div>
                        <div className="data">
                          <input
                            // guide={false}
                            type="text"
                            value={_.get(formData?.partner, 'stateTax', '')}
                            // keepCharPositions={false}
                            // mask={stateTaxMask}
                            className='form-control addVehicleSelect'
                            autoComplete='off'
                            onChange={(e) => onChange(e, _, "partner")}
                            name="stateTax"
                            style={styles?.inputStyles} />
                        </div>
                      </div>
                      <div className="card-info-item card-inner">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            County Tax
                          </p>
                        </div>
                        <div className="data">
                          <input
                            // guide={false}
                            type="text"
                            // keepCharPositions={false}
                            // mask={countyTaxMask}
                            className='form-control addVehicleSelect'
                            autoComplete='off'
                            onChange={(e) => onChange(e, _, "partner")}
                            value={_.get(formData?.partner, 'countyTax', '')}
                            name="countyTax"
                            style={styles?.inputStyles} />
                        </div>
                      </div>


                      <div className="card-info-item card-inner">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            Notes
                          </p>
                        </div>
                        <div className="data data_inner">
                          <textarea
                            className='form-control addVehicleSelect textarea_inner'
                            autoComplete='off'
                            onChange={(e) => onChange(e, _, "partner")}
                            value={_.get(formData?.partner, 'notes', '')}
                            name="notes"
                            style={styles?.inputStyles} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  className="mx-2 mt-3"
                  color='dark'
                  onClick={updatePartner}>
                  Update
                </Button>
                <Button
                  className="mt-3"
                  color='danger'
                  // isLight
                  // icon='PublishedWithChanges'
                  onClick={() => navigate('/partners')}>
                  Cancel
                </Button>
              </CardBody>
            </Card>
          </div >
        </div >
      </Page >
    </PageWrapper >
  )
}

const styles = {
  dateInput: {
    boxShadow: 'rgb(116 116 116 / 53%) 0px 0px 1px 1px inset',
    lineHeight: '1.5',
    padding: "0.5rem 3rem 0.5rem 1rem",
    height: "3.5rem",
    color: 'transparent',
  },
  onChangeColor: '#323232',
  inputStyles: {
    boxShadow: 'rgb(116 116 116 / 53%) 0px 0px 1px 1px inset',
    lineHeight: '1.5',
    padding: "0.5rem 3rem 0.5rem 1rem",
    height: "3.5rem"
  }
}

export default AddPartner;
