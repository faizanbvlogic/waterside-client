import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import InputMask from "react-text-mask"
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

import * as api from '../../../../api'
import { US_STATES } from '../../../../constants'
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../../../components/bootstrap/Card';
import Button from '../../../../components/bootstrap/Button';
import Select from '../../../../components/bootstrap/forms/Select';
import Page from '../../../../layout/Page/Page';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import moment from 'moment';
import DatePicker from 'react-date-picker';
import { setAlert, setLoading } from '../../../../globalState/action-creators';

const { REACT_APP_GOOGLE_ADDRESS_API_KEY } = process.env

const AddRenter = () => {

  const { id } = useParams()
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token')

  useEffect(
    () => {
      if (!token) {
        navigate('/auth-pages/login', { replace: true })
      }
      fetchRenter()
      // eslint-disable-next-line
    }, []
  )


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

  const [refetch, setRefetch] = useState(false)

  const [firstNameError, setFirstNameError] = useState(false)
  const [lastNameError, setLastNameError] = useState(false)
  const [dateOfBirthError, setDateOfBirthError] = useState(false)
  const [contactNumberError, setContactNumberError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [streetAddressError, setStreetAddressError] = useState(false)

  // const [cityError, setCityError] = useState(false)
  // const [stateError, setStateError] = useState(false)
  // const [driverLicenseError, setDriverLicenseError] = useState(false)
  // const [licenseExpirationDateError, setLicenseExpirationDateError] = useState(false)
  // const [driverLicenseNumberError, setDriverLicenseNumberError] = useState(false)
  // const [rentelInfoError, setRentelInfoError] = useState(false)
  // const [billingAddressError, setBillingAddressError] = useState(false)
  // const [zipcodeError, setZipCodeError] = useState(false)
  const [images, setImages] = useState({ images: [] })
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    city: "",
    state: "",
    driver_license_images: "",
    license_expiration_date: "",
    street_address: "",
    driver_license_number: "",
    rentel_info: "",
    billing_address: "",
    zipcode: ""
  });
  const [isAddressError, setAddressError] = useState(false)


  const fetchRenter = async () => {
    dispatch(setLoading(true));
    try {
      const { data } = await api.getRenterById(id)
      if (data?.success) {
        setFormData(_.get(data, "renter", formData))
        setImages(_.get(data, 'driver_license_images', []))
      }
      else {
        dispatch(setAlert(data?.message, "Error"))
      }
    } catch (error) {
      dispatch(setAlert(error?.message, "Error"))
    }
    dispatch(setLoading(false))
  }

  const updateRenter = async () => {
    dispatch(setLoading(true))
    try {
      // const reWord = /^[A-Za-z _]+$/;
      // const reDigit = /^[0-9]*$/;
      // const regAddress = /^[a-zA-Z0-9\s,.'-//]{3,}$/;
      const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      let error = false

      if (_.get(formData, "firstName", "")?.length <= 0) {
        error = true;
        setFirstNameError(true)
      }
      if (_.get(formData, "lastName", "")?.length <= 0) {
        error = true;
        setLastNameError(true)
      }
      if (_.get(formData, "dateOfBirth", "")?.length <= 0) {
        error = true;
        setDateOfBirthError(true)
      }
      if (_.get(formData, "email", "")?.length <= 0 || !regex.test(_.get(formData, "email", ""))) {
        error = true;
        setEmailError(true)
      }
      // if (_.get(formData, "city", "")?.length <= 0) {
      //   error = true;
      //   setCityError(true)
      // }
      // if (_.get(formData, "state", "")?.length <= 0) {
      //   error = true;
      //   setStateError(true)
      // }
      // if (_.get(formData, "driver_license_images", "")?.length <= 0) {
      //   error = true;
      //   setDriverLicenseError(true)
      // }
      // if (_.get(formData, "license_expiration_date", "")?.length <= 0) {
      //   error = true;
      //   setLicenseExpirationDateError(true)
      // }
      if (_.get(formData, "street_address", "")?.length <= 0) {
        error = true;
        setAddressError(true)
      }
      // if (_.get(formData, "driver_license_number", "")?.length <= 0) {
      //   error = true;
      //   setDriverLicenseNumberError(true)
      // }
      // if (_.get(formData, "rentel_info", "")?.length <= 0) {
      //   error = true;
      //   setRentelInfoError(true)
      // }
      // if (_.get(formData, "billing_address", "")?.length <= 0) {
      //   error = true;
      //   setBillingAddressError(true)
      // }
      // if (_.get(formData, "zipcode", "")?.length <= 0) {
      //   error = true;
      //   setZipCodeError(true)
      // }
      if ((_.get(formData, 'phoneNumber', '').length > 0 && _.get(formData, 'phoneNumber', '')?.replace(/[^\d]/g, "").length < 10) || _.get(formData, 'phoneNumber', '').length <= 0) {
        error = true
        setContactNumberError(true)
      }

      formData.phoneNumber = _.get(formData, 'phoneNumber', '').length > 0 ? _.get(formData, 'phoneNumber', '')?.replace(/[^\d]/g, "") : ""

      if (!error) {
        const { data } = await api.updateRenter(id, formData);
        if (data?.success) {
          navigate('/residents_information')
        } else {
          dispatch(setAlert(data?.message, "Error"))
        }
      }
    }
    catch (error) {
      dispatch(setAlert(error?.message, "Error"))
    }
    dispatch(setLoading(false))
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "firstName") {
      setFirstNameError(false)
    }
    if (name === "lastName") {
      setLastNameError(false)
    }
    // if (name === "dateOfBirth") {
    //   setDateOfBirthError(false)
    // }
    if (name === "phoneNumber") {
      setContactNumberError(false)
    }
    if (name === "email") {
      setEmailError(false)
    }
    // if (name === "city") {
    //   setCityError(false)
    // }
    // if (name === "state") {
    //   setStateError(false)
    // }
    // if (name === "driver_license_images") {
    //   setDriverLicenseError(false)
    // }
    // if (name === "license_expiration_date") {
    //   setLicenseExpirationDateError(false)
    // }
    if (name === "street_address") {
      setStreetAddressError(false)
    }
    // if (name === "driver_license_number") {
    //   setDriverLicenseNumberError(false)
    // }
    // if (name === "rentel_info") {
    //   setRentelInfoError(false)
    // }
    // if (name === "billing_address") {
    //   setBillingAddressError(false)
    // }
    // if (name === "zipcode") {
    //   setZipCodeError(false)
    // }

    setFormData({ ...formData, [name]: value })
  }

  const onDrop = async (files) => {
    var _URL = window.URL || window.webkitURL
    if (files?.target?.name === "driver_license_images" || files?.target?.name === "driver_license_back_images") {
      if (files.target.files[0] !== undefined) {
        let driver_license_images = []
        let driver_license_back_images = []
        Object.keys(files.target.files).forEach(file => {
          if ((files.target.files[file].type.split("/")[0] === "image" || files.target.files[file].type.split("/")[1] === "pdf") && files.target.files[file].type.split("/")[1] !== "gif") {
            var img = new Image()
            let reader = new FileReader()
            reader.onloadend = async () => {
              img.src = _URL.createObjectURL(files.target.files[file])
              if (files.target.files[file].type.split("/")[1] !== "pdf") {
                img.onload = async () => {
                  let name = files.target.files[file].name ? `${files.target.files[file].name.replace(/-|\s/g, "-").trim()}` : `${Math.floor(Math.random() * 100)}`;
                  files?.target?.name === "driver_license_images" && driver_license_images.push({ name, imagePreviewUrl: reader.result })
                  files?.target?.name === "driver_license_back_images" && driver_license_back_images.push({ name, imagePreviewUrl: reader.result })
                  files?.target?.name === "driver_license_images" && setFormData(
                    {
                      ...formData,
                      driver_license_images: [...driver_license_images]
                    }
                  )
                  files?.target?.name === "driver_license_back_images" && setFormData(
                    {
                      ...formData,
                      driver_license_back_images: [...driver_license_back_images]
                    }
                  )
                }
              }
              else {
                let name = files.target.files[file].name ? `${files.target.files[file].name.replace(/-|\s/g, "-").trim()}` : `${Math.floor(Math.random() * 100)}`;
                files?.target?.name === "driver_license_images" && driver_license_images.push({ name, imagePreviewUrl: reader.result })
                files?.target?.name === "driver_license_back_images" && driver_license_back_images.push({ name, imagePreviewUrl: reader.result })
                files?.target?.name === "driver_license_images" && setFormData(
                  {
                    ...formData,
                    driver_license_images: [...driver_license_images]
                  }
                )
                files?.target?.name === "driver_license_back_images" && setFormData(
                  {
                    ...formData,
                    driver_license_back_images: [...driver_license_back_images]
                  }
                )
              }
            }
            reader.readAsDataURL(files.target.files[file])
          } else {
            dispatch(
              setAlert(
                "Invalid File Type",
                "Error"
              )
            )
          }
        })
      }
    }
    else {
      let driver_license_images = []
      let driver_license_back_images = []
      console.log(files?.target, "target<<<<")
      files.forEach(file => {
        if (file.type.split("/")[0] === "image" && file.type.split("/")[1] !== "gif") {
          var img = new Image()
          let reader = new FileReader()
          reader.onloadend = async () => {
            img.src = _URL.createObjectURL(file)
            img.onload = async () => {
              let name = file.name ? file.name.replace(/-|\s/g, "-").trim() : Math.floor(Math.random() * 100);
              driver_license_images.push({ name, imagePreviewUrl: reader.result })
              setImages({ images: [...formData?.driver_license_images, ...driver_license_images] })
              setFormData(
                {
                  ...formData,
                  driver_license_images: [...formData?.driver_license_images, ...driver_license_images]
                }
              )
            }
          }
          reader.readAsDataURL(file)
        } else {
          dispatch(
            setAlert(
              "Invalid File Type",
              "Error"
            )
          )
        }
      })
    }
  }

  const openInNewTab = url => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };


  return (
    <PageWrapper title="Add vehicle">
      <Page container='fluid'>
        <div className="row">
          <div className="col-xxl-6">
            <Card stretch>
              <CardHeader>
                <CardLabel icon="Edit" iconColor="dark">
                  <CardTitle tag="h4" className="h5">
                    Edit Renter
                  </CardTitle>
                </CardLabel>
              </CardHeader>
              <CardBody>
                <div className="row">
                  <div className='create_vehicle_inner'>
                    <div className='create-vehicle-wrapper add_vehicle'>
                      <div className="card-info-item card-inner">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            First Name <span className='text-danger fw-bold'>*</span>
                          </p>
                        </div>
                        <div className="data">
                          <input type="text"
                            id='firstName'
                            className='form-control addVehicleSelect'
                            autoComplete='off'
                            value={_.get(formData, "firstName", "")}
                            onChange={(e) => {
                              onChange(e)
                            }}
                            name="firstName" />
                        </div>
                        <span className='text-danger danger-msg'>{firstNameError ? "First name required!" : ''}</span>
                      </div>
                      <div className="card-info-item card-inner">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            Last Name <span className='text-danger fw-bold'>*</span>
                          </p>
                        </div>
                        <div className="data">
                          <input type="text"
                            id='lastName'
                            className='form-control addVehicleSelect'
                            autoComplete='off'
                            value={_.get(formData, "lastName", "")}
                            onChange={(e) => {
                              onChange(e)
                            }}
                            name="lastName" />
                        </div>
                        <span className='text-danger danger-msg'>{lastNameError ? "Last name required!" : ''}</span>
                      </div>
                      <div className="card-info-item card-inner">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            DOB <span className='text-danger fw-bold'>*</span>
                          </p>
                        </div>
                        <div className="data">
                          <DatePicker
                            className='form-control addVehicleSelect input_feild'
                            clearIcon={null}
                            name="dateOfBirth"
                            onChange={(e) => {
                              setFormData({ ...formData, dateOfBirth: moment(e).format('MM/DD/yyyy') });
                              setDateOfBirthError(false)
                            }
                            }
                            format="MM/dd/yyyy"
                            value={formData?.dateOfBirth && formData?.dateOfBirth?.length > 0 ? new Date(formData?.dateOfBirth) : ""}
                          />
                        </div>
                        <span className='text-danger danger-msg'>{dateOfBirthError ? "Date of birth required!" : ''}</span>
                      </div>
                      <div className="card-info-item card-inner">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            Email <span className='text-danger fw-bold'>*</span>
                          </p>
                        </div>
                        <div className="data">
                          <input type="text"
                            id='email'
                            className='form-control addVehicleSelect'
                            autoComplete='off'
                            value={_.get(formData, "email", "")}
                            onChange={(e) => {
                              onChange(e)
                            }}
                            name="email" />
                        </div>
                        <span className='text-danger danger-msg'>{emailError ? "Invalid Email!" : ''}</span>
                      </div>
                      <div className="card-info-item card-inner">
                        <div className="label">
                          <p className='mx-3 lable_spacing' >
                            Phone Number <span className='text-danger'>*</span>
                          </p>
                        </div>
                        <div className="data">
                          <InputMask
                            guide={false}
                            type="text"
                            value={_.get(formData, `phoneNumber`, "")}
                            // keepCharPositions={false}
                            mask={phoneNumberMask}
                            className="form-control addVehicleSelect delete_form_input addpartner_withoutbtn"
                            name="phoneNumber"
                            onChange={(e) => onChange(e)}
                          />
                        </div>
                        <span className='text-danger danger-msg'>{contactNumberError ? "Enter a valid phone number!" : ''}</span>
                      </div>
                      <div className="card-info-item card-inner">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            Home Address <span className='text-danger fw-bold'>*</span>
                          </p>
                        </div>
                        <div className="data address-createpartner"
                          onFocus={() => setAddressError(false)}
                        >
                          {_.get(formData, "street_address", "").length > 0 &&
                            <GooglePlacesAutocomplete
                              apiKey={REACT_APP_GOOGLE_ADDRESS_API_KEY}
                              apiOptions={{ language: 'en', region: 'us' }}
                              autocompletionRequest={{
                                componentRestrictions: {
                                  country: ["us"], //to set the specific country
                                },
                              }}
                              selectProps={{
                                defaultInputValue: _.get(formData, "street_address", ""),
                                isClearable: true,
                                onChange: (e) => {
                                  // console.log(e?.value?.terms)
                                  setFormData({
                                    ...formData,
                                    street_address: e?.label,
                                    state: e?.value?.terms[e?.value?.terms?.length - 2]?.value,
                                    city: e?.value?.terms[e?.value?.terms?.length - 3]?.value
                                  })
                                  // setCityError(false)
                                  // setStateError(false)
                                }
                              }}
                            />
                          }
                          {(!_.get(formData, "street_address", "") || _.get(formData, "street_address", "") === undefined || _.get(formData, "street_address", "")?.length <= 0) &&
                            <GooglePlacesAutocomplete
                              apiKey={REACT_APP_GOOGLE_ADDRESS_API_KEY}
                              apiOptions={{ language: 'en', region: 'us' }}
                              autocompletionRequest={{
                                componentRestrictions: {
                                  country: ["us"], //to set the specific country
                                },
                              }}
                              selectProps={{
                                isClearable: true,
                                onChange: (e) => {
                                  // console.log(e?.value?.terms)
                                  setFormData({
                                    ...formData,
                                    street_address: e?.label,
                                    state: e?.value?.terms[e?.value?.terms?.length - 2]?.value,
                                    city: e?.value?.terms[e?.value?.terms?.length - 3]?.value
                                  })
                                  // setCityError(false)
                                  // setStateError(false)
                                }
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
                          <input type='text'
                            id='city'
                            className='form-control addVehicleSelect'
                            autoComplete='off'
                            name="city"
                            value={_.get(formData, "city", "")}
                            onChange={(e) => {
                              onChange(e)
                            }}
                          />
                        </div>
                        {/* <span className='text-danger danger-msg'>{cityError ? "City required!" : ''}</span> */}
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
                            id="state"
                            name="state"
                            value={_.get(formData, "state", "")}
                            onChange={(e) => {
                              onChange(e)
                            }}
                            list={US_STATES}
                            className="addVehicleSelect inputBoxShadow"
                          />
                        </div>
                        {/* <span className='text-danger danger-msg'>{stateError ? "State required!" : ''}</span> */}
                      </div>
                      <div className="card-info-item card-inner">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            Zip Code 
                          </p>
                        </div>
                        <div className="data">
                          <input type='text'
                            id='zipcode'
                            className='form-control addVehicleSelect'
                            autoComplete='off'
                            name="zipcode"
                            value={_.get(formData, "zipcode", "")}
                            onChange={(e) => {
                              onChange(e)
                            }}
                          />
                        </div>
                        {/* <span className='text-danger danger-msg'>{zipcodeError ? "Zipcode required!" : ''}</span> */}
                      </div>
                      <div className="card-info-item card-inner">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            Billing Address 
                          </p>
                        </div>
                        <div className="data">
                          <input type='text'
                            className='form-control addVehicleSelect'
                            autoComplete='off'
                            value={_.get(formData, "billing_address", "")}
                            onChange={(e) => {
                              onChange(e)
                            }}
                            name="billing_address"
                          />
                        </div>
                        {/* <span className='text-danger danger-msg'>{billingAddressError ? "Billing address required!" : ''}</span> */}
                      </div>

                      <div className="card-info-item card-inner">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            License Expiration Date
                          </p>
                        </div>
                        <div className="data">
                          <DatePicker
                            className='form-control addVehicleSelect input_feild'
                            clearIcon={null}
                            name="license_expiration_date"
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                license_expiration_date: moment(e).format('MM/DD/yyyy')
                              });
                              // setLicenseExpirationDateError(false)
                            }}
                            format="MM/dd/yyyy"
                            value={formData?.license_expiration_date && formData?.license_expiration_date?.length > 0 ? new Date(formData?.license_expiration_date) : ""}
                          />
                        </div>
                        {/* <span className='text-danger danger-msg'>{licenseExpirationDateError ? "License expiration date required!" : ''}</span> */}
                      </div>

                      <div className="card-info-item card-inner">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            Driver License Number 
                          </p>
                        </div>
                        <div className="data">
                          <input type='text'
                            className='form-control addVehicleSelect'
                            autoComplete='off'
                            name="driver_license_number"
                            value={_.get(formData, "driver_license_number", "")}
                            onChange={(e) => {
                              onChange(e)
                            }}
                          />
                        </div>
                        {/* <span className='text-danger danger-msg'>{driverLicenseNumberError ? "License expiration date required!" : ''}</span> */}
                      </div>
                      <div className="card-info-item card-inner">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            Insurance Company Name 
                          </p>
                        </div>
                        <div className="data">
                          <input type="text"
                            className='form-control addVehicleSelect'
                            autoComplete='off'
                            value={_.get(formData, "rentel_info", "")}
                            onChange={(e) => {
                              onChange(e)
                            }}
                            name="rentel_info"
                          />
                        </div>
                        {/* <span className='text-danger danger-msg'>{rentelInfoError ? "Insurance company name required!" : ''}</span> */}
                      </div>
                      <div className="card-info-item card-inner ">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            Driver License Images (Front) 
                          </p>
                        </div>
                        <div className="data">
                          <input type='file'
                            className='form-control addVehicleSelect choose_file'
                            autoComplete='off'
                            name="driver_license_images"
                            accept='.jpg,.jpeg,.png,.pdf'
                            onChange={(e) => {
                              onDrop(e)
                              // setDriverLicenseError(false)
                            }}
                          // multiple
                          />
                        </div>
                        <div className="imageGrid">
                          {formData?.driver_license_images && formData?.driver_license_images?.map((image, index) => {
                            if (image?.name?.substring(image?.name?.length - 3,) !== "pdf") {
                              return (
                                <React.Fragment key={index}>
                                  <img src={image?.imagePreviewUrl} alt="Documents" style={{ width: '200px', margin: '10px' }} />
                                  <div className='closeSpanDiv'>
                                    <span className='closeSpan'
                                      onClick={
                                        () => {
                                          formData?.driver_license_images?.splice(index, 1)
                                          setRefetch(!refetch)
                                          setFormData({
                                            ...formData,
                                            driver_license_images: formData?.driver_license_images
                                          })
                                        }
                                      }
                                    >&times;</span>
                                  </div>
                                </React.Fragment>
                              )
                            }
                            else {
                              return (
                                <React.Fragment key={index}>
                                  <div className='pdf_btn' >
                                    <div onClick={() => openInNewTab(image?.imagePreviewUrl)} className="download-pdf">
                                      <strong>Download (PDF)</strong>
                                    </div>
                                    <div className='closeSpanDiv'>
                                      <span className='closeSpan'
                                        onClick={
                                          () => {
                                            formData?.driver_license_images?.splice(index, 1)
                                            setRefetch(!refetch)
                                            setFormData({
                                              ...formData,
                                              driver_license_images: formData?.driver_license_images
                                            })
                                          }
                                        }
                                      >&times;</span>
                                    </div>
                                  </div>
                                </React.Fragment>
                              )
                            }

                          })}
                        </div>
                        {/* <span className='text-danger danger-msg'>{driverLicenseError ? "Driver license image required!" : ''}</span> */}
                      </div>
                      <div className="card-info-item card-inner ">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            Driver License Images (Back) 
                          </p>
                        </div>
                        <div className="data">
                          <input type='file'
                            className='form-control addVehicleSelect choose_file'
                            autoComplete='off'
                            name="driver_license_back_images"
                            accept='.jpg,.jpeg,.png,.pdf'
                            onChange={(e) => {
                              onDrop(e)
                              // setDriverLicenseError(false)
                            }}
                          // multiple
                          />
                        </div>
                        <div className="imageGrid">
                          {formData?.driver_license_back_images && formData?.driver_license_back_images?.map((image, index) => {
                            if (image?.name?.substring(image?.name?.length - 3,) !== "pdf") {
                              return (
                                <React.Fragment key={index}>
                                  <img src={image?.imagePreviewUrl} alt="Documents" style={{ width: '200px', margin: '10px' }} />
                                  <div className='closeSpanDiv'>
                                    <span className='closeSpan'
                                      onClick={
                                        () => {
                                          formData?.driver_license_back_images?.splice(index, 1)
                                          setRefetch(!refetch)
                                          setFormData({
                                            ...formData,
                                            driver_license_back_images: formData?.driver_license_back_images
                                          })
                                        }
                                      }
                                    >&times;</span>
                                  </div>
                                </React.Fragment>
                              )
                            }
                            else {
                              return (
                                <React.Fragment key={index}>
                                  <div className='pdf_btn' >
                                    <div onClick={() => openInNewTab(image?.imagePreviewUrl)} className="download-pdf">
                                      <strong>Download (PDF)</strong>
                                    </div>
                                    <div className='closeSpanDiv'>
                                      <span className='closeSpan'
                                        onClick={
                                          () => {
                                            formData?.driver_license_back_images?.splice(index, 1)
                                            setRefetch(!refetch)
                                            setFormData({
                                              ...formData,
                                              driver_license_back_images: formData?.driver_license_back_images
                                            })
                                          }
                                        }
                                      >&times;</span>
                                    </div>
                                  </div>
                                </React.Fragment>
                              )
                            }

                          })}
                        </div>
                        {/* <span className='text-danger danger-msg'>{driverLicenseError ? "Driver license image required!" : ''}</span> */}
                      </div>

                    </div>
                  </div>
                </div>
                {
                  <span className='text-danger danger-msg'>{
                    (firstNameError ||
                      lastNameError ||
                      dateOfBirthError ||
                      contactNumberError ||
                      // cityError ||
                      // stateError ||
                      // driverLicenseError ||
                      // licenseExpirationDateError ||
                      // driverLicenseNumberError ||
                      // rentelInfoError ||
                      // billingAddressError ||
                      // zipcodeError ||
                      streetAddressError 
                      ) &&
                    "Please fill out all required fields!"}</span>
                }

                <Button
                  className="mx-2 mt-3"
                  color='dark'
                  onClick={updateRenter}>
                  Save
                </Button>
                <Button
                  className="mt-3"
                  color='danger'
                onClick={() => navigate('/residents_information')}
                >
                  Cancel
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </Page>
    </PageWrapper >
  )
}

export default AddRenter;
