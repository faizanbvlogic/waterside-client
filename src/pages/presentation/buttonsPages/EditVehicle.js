import React, { useEffect, useState } from 'react'
import * as api from '../../../api'
import Dropzone from 'react-dropzone'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import _ from 'lodash'
import DatePicker from 'react-date-picker';
import moment from 'moment'
import Button from '../../../components/bootstrap/Button';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../../components/bootstrap/Card';
import Select from '../../../components/bootstrap/forms/Select';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Icon from '../../../components/icon/Icon';
import { setAlert, setLoading } from '../../../globalState/action-creators';

const EditVehicle = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = localStorage.getItem('token')
  useEffect(
    () => {
      if (!token) {
        navigate('/auth-pages/login', { replace: true })
      }
      fetchPartners()
      // eslint-disable-next-line
    }, []
  )

  const _vehiclesColor = [
    { value: '#000000', text: 'Black' },
    { value: '#62b9d4', text: 'Blue' },
    { value: '#7b6a43', text: 'Camo' },
    { value: '#0f58e3', text: 'Cobalt' },
    { value: '#00473b', text: 'Green' },
    { value: '#fc9749', text: 'Orange' },
    { value: '#d799be', text: 'Pink' },
    { value: '#c42828', text: 'Red' },
    { value: '#ffcbff', text: 'Rose' },
    { value: '#f3f4f3', text: 'White' },
    { value: '#fce832', text: 'Yellow' },

    // { value: '#004225', text: 'RACING' },
  ];
  const _backseatType = [
    { value: 'bench', text: 'Bench' },
    { value: 'two chairs', text: 'Two Chairs' },
  ];

  const _backseatColor = [
    { value: 'black', text: 'Black' },
    { value: 'white', text: 'white' }
  ];

  const _vehicle_status = [
    { value: 'active', text: 'Active' },
    { value: 'inActive', text: 'Inactive' }
  ];


  const [vehicleColorError, setVehicleColorError] = useState(false)
  const [yearOfMakeError, setyearOfMakeError] = useState(false)
  const [backseatColorError, setBackseatColorError] = useState(false)
  const [partnerIdError, setPartnerIdError] = useState(false)
  const [backseatTypeError, setBackseatTypeError] = useState(false)
  const [licensePlatesError, setLicensePlatesError] = useState(false)
  const [licensePlatesStateError, setLicensePlatesStateError] = useState(false)

  // for Update a vehicle 
  const [formData, setFormData] = useState({
    vehicleColor: "",
    yearOfMake: "",
    backseatColor: "",
    partnerId: "",
    backseatType: "",
    gps_imei: "",
    gps_device_install_date: "",
    battery_serial_number: "",
    battery_install_date: "",
    lockbox_serial_number: "",
    admin_passcode: "",
    lockbox_install_date: "",
    licensePlates: "",
    licensePlatesState: "",
    vin: "",
    registrationExpDate: "",
    titleImages: [],
    registrationImages: [],
    vehicleImages: [],
    qrCodeImages: [],
    status: ""
  });

  const [partnersData, setpartnersData] = useState([])

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "vehicleColor") {
      setVehicleColorError(false)
    }
    if (name === "yearOfMake") {
      setyearOfMakeError(false)
    }
    if (name === "backseatColor") {
      setBackseatColorError(false)
    }
    if (name === "partnerId") {
      setPartnerIdError(false)
    }
    if (name === "backseatType") {
      setBackseatTypeError(false)
    }
    if (name === "licensePlates") {
      setLicensePlatesError(false)
    }
    if (name === "licensePlatesState") {
      setLicensePlatesStateError(false)
    }
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const fetchPartners = async () => {
    try {
      const { data } = await api.getPartners();
      if (data?.success) {
        const optionArray = []
        _.get(data, 'partners', []).map((partner, i) => {
          optionArray.push({ value: partner?._id, text: partner?.partnerName })
          return null
        })
        setpartnersData(optionArray)
        getVehicle(id)
      }
    } catch (error) {
      dispatch(setAlert(error?.message, "Error"))
    };
  };


  // GET VEHICLES DATA 
  const getVehicle = async (id) => {
    dispatch(setLoading(true))
    try {
      const { data } = await api.getVehicleById(id)
      if (data?.success) {
        setFormData(_.get(data, "vehicle", { ...formData }))
        setImages({ images: _.get(data, 'vehicle.vehicleImages', []) })
      }
      else {
        dispatch(setAlert(data?.message, "Error"))
      }
    } catch (error) {
      dispatch(setAlert(error?.message, "Error"))
    }
    dispatch(setLoading(false))
  }


  const updateVehicle = async () => {
    dispatch(setLoading(true))
    try {
      let error;
      const reDigit = /^[0-9]*$/;
      let re = /^[A-Za-z0-9]*$/;

      if (_.get(formData, "vehicleColor", "")?.length <= 0) {
        error = true
        setVehicleColorError(true)
      }
      if (_.get(formData, "yearOfMake", "")?.length <= 0 || !reDigit.test(_.get(formData, "yearOfMake", ""))) {
        error = true
        setyearOfMakeError(true)
      }
      if (_.get(formData, "backseatColor", "")?.length <= 0) {
        error = true
        setBackseatColorError(true)
      }
      if (_.get(formData, "partnerId", "")?.length <= 0) {
        error = true
        setPartnerIdError(true)
      }
      if (_.get(formData, "backseatType", "")?.length <= 0) {
        error = true
        setBackseatTypeError(true)
      }
      if (_.get(formData, "licensePlates", "")?.length <= 0) {
        error = true
        setLicensePlatesError(true)
      }
      // if (_.get(formData, "licensePlatesState", "")?.length <= 0 || !re.test(_.get(formData, "licensePlatesState", ""))) {
      //   error = true
      //   setLicensePlatesStateError(true)
      // }

      if (!error) {
        const { data } = await api.editVehicle(id, formData);
        if (data?.success) {
          navigate('/vehicles')
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
  };

  const [refetch, setRefetch] = useState(false)
  const [images, setImages] = useState({ images: _.get(formData, 'vehicleImages', []) })
  const onDropRejected = (files) => {
    if (files) {
      files.forEach(file => {
        dispatch(
          setAlert(
            `Please insert a file less than 3 MB!`,
            "Error"
          )
        )
      })
    }
  }
  const onDrop = async (files) => {
    var _URL = window.URL || window.webkitURL
    if (files?.target?.name === "title" || files?.target?.name === "uploadRegistrationCardImage" || files?.target?.name === "qrCodeImages") {
      if (files.target.files[0] !== undefined) {
        let titleImage = []
        let RegImage = []
        let qrCodeImages = []
        Object.keys(files.target.files).forEach(file => {
          if ((files.target.files[file].type.split("/")[0] === "image" || files.target.files[file].type.split("/")[1] === "pdf") && files.target.files[file].type.split("/")[1] !== "gif") {
            var img = new Image()
            let reader = new FileReader()
            reader.onloadend = async () => {
              img.src = _URL.createObjectURL(files.target.files[file])
              if (files.target.files[file].type.split("/")[1] !== "pdf") {
                img.onload = async () => {
                  let name = files.target.files[file].name ? `${files.target.files[file].name.replace(/-|\s/g, "-").trim()}` : `${Math.floor(Math.random() * 100)}`;
                  files?.target?.name === "title" && titleImage.push({ name, imagePreviewUrl: reader.result }) 
                  files?.target?.name === "uploadRegistrationCardImage" && RegImage.push({ name, imagePreviewUrl: reader.result })
                  files?.target?.name === "qrCodeImages" && qrCodeImages.push({ name, imagePreviewUrl: reader.result })
                  files?.target?.name === "title" && setFormData(
                    {
                      ...formData,
                      titleImages: [...titleImage]
                    }
                  ) 
                  files?.target?.name === "uploadRegistrationCardImage" &&  setFormData(
                    {
                      ...formData,
                      registrationImages: [...RegImage]
                    }
                  )
                  files?.target?.name === "qrCodeImages" &&  setFormData(
                    {
                      ...formData,
                      qrCodeImages: [...qrCodeImages]
                    }
                  )
                }
              }
              else {
                let name = files.target.files[file].name ? `${files.target.files[file].name.replace(/-|\s/g, "-").trim()}` : `${Math.floor(Math.random() * 100)}`;
                files?.target?.name === "title" && titleImage.push({ name, imagePreviewUrl: reader.result }) 
                files?.target?.name === "uploadRegistrationCardImage" && RegImage.push({ name, imagePreviewUrl: reader.result })
                files?.target?.name === "qrCodeImages" && qrCodeImages.push({ name, imagePreviewUrl: reader.result })
                // setImages({ images: [...image] })
                console.log(titleImage)
                files?.target?.name === "title" && setFormData(
                  {
                    ...formData,
                    titleImages: [...titleImage]
                  }
                ) 
                files?.target?.name === "uploadRegistrationCardImage" && setFormData(
                  {
                    ...formData,
                    registrationImages: [...RegImage]
                  }
                )
                files?.target?.name === "qrCodeImages" && setFormData(
                  {
                    ...formData,
                    qrCodeImages: [...qrCodeImages]
                  }
                )
              }
            }
            reader.readAsDataURL(files.target.files[file])

          } else {
            dispatch(
              setAlert(
                `Invalid File Type!`,
                "Error"
              )
            )
          }
        })
      }
    }
    else {
      let vehicleImages = []
      files.forEach(file => {
        if (file.type.split("/")[0] === "image" && file.type.split("/")[1] !== "gif") {
          var img = new Image()
          let reader = new FileReader()
          reader.onloadend = async () => {
            img.src = _URL.createObjectURL(file)
            img.onload = async () => {
              let name = file.name ? file.name.replace(/-|\s/g, "-").trim() : Math.floor(Math.random() * 100);
              vehicleImages.push({ name, imagePreviewUrl: reader.result })
              setImages({ images: [...formData?.vehicleImages, ...vehicleImages] })
              setFormData(
                {
                  ...formData,
                  vehicleImages: [...formData?.vehicleImages, ...vehicleImages]
                }
              )
            }
          }
          reader.readAsDataURL(file)
        } else {
          dispatch(
            setAlert(
              `Invalid File Type!`,
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
                    Edit vehicle
                  </CardTitle>
                </CardLabel>
              </CardHeader>
              <CardBody>
                <div className="row">
                  <div className='mx-2'>
                    <p><strong>Vehicle Features</strong></p>
                  </div>
                  <div className='create-vehicle-wrapper add_vehicle'>
                    <div className="card-info-item card-inner">
                      <div className="label">
                        <p className='mx-3 lable_spacing'>
                          Vehicle Color <span className='text-danger fw-bold'>*</span>
                        </p>
                      </div>
                      <div className="data">
                        <Select
                          ariaLabel='Default select example'
                          placeholder=' '
                          value={formData?.vehicleColor}
                          style={{ boxShadow: 'rgb(116 116 116 / 53%) 0px 0px 1px 1px inset' }}
                          id="vehicleColor"
                          name="vehicleColor"
                          onChange={(e) => {
                            onChange(e)
                          }}
                          list={_vehiclesColor}
                          className="addVehicleSelect inputBoxShadow"
                        />
                      </div>
                      <span id="vehicleColorSpan" className='text-danger danger-msg'>{vehicleColorError && "Please enter a vehicle color!"}</span>
                    </div>
                    <div className="card-info-item card-inner">
                      <div className="label">
                        <p className='mx-3 lable_spacing'>
                          Year Of Make <span className='text-danger fw-bold'>*</span>
                        </p>
                      </div>
                      <div className="data">
                        <input type="text"
                          id='yearOfMake'
                          value={formData?.yearOfMake}
                          className='form-control addVehicleSelect'
                          autoComplete='off'
                          onChange={(e) => {
                            onChange(e)
                          }}
                          name="yearOfMake"
                          style={styles?.inputStyles} />
                      </div>
                      <span id="yearOfMakeSpan" className='text-danger danger-msg'>{yearOfMakeError && "Please enter a valid year!"}</span>
                    </div>
                    <div className="card-info-item card-inner">
                      <div className="label">
                        <p className='mx-3 lable_spacing'>
                          Partner <span className='text-danger fw-bold'>*</span>
                        </p>
                      </div>
                      <div className="data">
                        <Select
                          ariaLabel='Default select example'
                          placeholder=' '
                          value={formData?.partnerId}
                          id="partnerId"
                          style={{ boxShadow: 'rgb(116 116 116 / 53%) 0px 0px 1px 1px inset' }}
                          name="partnerId"
                          onChange={(e) => {
                            onChange(e)
                          }}
                          list={partnersData}
                          className="addVehicleSelect inputBoxShadow"
                        />
                      </div>
                      <span id="hotelSpan" className='text-danger danger-msg'>{partnerIdError && "Please select a partner!"}</span>
                    </div>
                     <div className="card-info-item card-inner">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            License Plates Number <span className='text-danger fw-bold'>*</span>
                          </p>
                        </div>
                        <div className="data">
                          <input type='text'
                            id='licensePlates'
                            className='form-control addVehicleSelect'
                            autoComplete='off'
                            name="licensePlates"
                            value={formData?.licensePlates}
                            onChange={(e) => {
                              onChange(e)
                            }}
                            style={styles?.inputStyles} />
                        </div>
                        <span id="licensePlatesSpan" className='text-danger danger-msg'>{licensePlatesError && "License Plate Number required!"}</span>
                      </div>
                      <div className="card-info-item card-inner">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            License Plates State
                          </p>
                        </div>
                        <div className="data">
                          <input type='text'
                            className='form-control addVehicleSelect'
                            autoComplete='off'
                            name="licensePlatesState"
                            value={formData?.licensePlatesState}
                            onChange={(e) => {
                              onChange(e)
                            }}
                            style={styles?.inputStyles} />
                        </div>
                        <span id="licensePlatesStateSpan" className='text-danger danger-msg'>{licensePlatesStateError && "Please enter a license plates state!"}</span>
                      </div>
                      <div className="card-info-item card-inner ">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            Vin
                          </p>
                        </div>
                        <div className="data">
                          <input type='text'
                            className='form-control addVehicleSelect'
                            autoComplete='off'
                            name="vin"
                            onChange={(e) => {
                              onChange(e)
                            }}
                            value={formData?.vin}
                            style={styles?.inputStyles} />
                        </div>
                        <span id="vinSpan" style={{ position: 'absolute', opacity: '0', color: 'crimson' }}></span>
                      </div>


                    <div className="card-info-item card-inner">
                      <div className="label">
                        <p className='mx-3 lable_spacing'>
                          Backseat Color <span className='text-danger fw-bold'>*</span>
                        </p>
                      </div>
                      <div className="data">
                        <Select
                          ariaLabel='Default select example'
                          placeholder=' '
                          // value=""
                          value={formData?.backseatColor}
                          id="backseatColor"
                          style={{ boxShadow: 'rgb(116 116 116 / 53%) 0px 0px 1px 1px inset' }}
                          name="backseatColor"
                          onChange={(e) => {
                            onChange(e)
                          }}
                          list={_backseatColor}
                          className="addVehicleSelect inputBoxShadow"
                        />
                      </div>
                      <span id="backseatColorSpan" className='text-danger danger-msg'>{backseatColorError && "Please select a backseat color!"}</span>
                    </div>
                    <div className="card-info-item card-inner">
                      <div className="label">
                        <p className='mx-3 lable_spacing'>
                          Backseat Type <span className='text-danger fw-bold'>*</span>
                        </p>
                      </div>
                      <div className="data">
                        <Select
                          ariaLabel='Default select example'
                          placeholder=' '
                          value={formData?.backseatType}
                          id="backseatType"
                          name="backseatType"
                          style={{ boxShadow: 'rgb(116 116 116 / 53%) 0px 0px 1px 1px inset' }}
                          onChange={(e) => {
                            onChange(e)
                          }}
                          list={_backseatType}
                          className="addVehicleSelect inputBoxShadow"
                        />
                      </div>
                      <span id="backseatTypeSpan" className='text-danger danger-msg'>{backseatTypeError && "Please select a backseat type!"}</span>
                    </div>
                    <div className="card-info-item card-inner">
                      <div className="label">
                        <p className='mx-3 lable_spacing'>
                         Status
                        </p>
                      </div>
                      <div className="data">
                        <Select
                          ariaLabel='Default select example'
                          placeholder=' '
                          value={_.get(formData, "status", "active")}
                          id="status"
                          name="status"
                          style={{ boxShadow: 'rgb(116 116 116 / 53%) 0px 0px 1px 1px inset' }}
                          onChange={(e) => {
                            onChange(e)
                          }}
                          list={_vehicle_status}
                          className="addVehicleSelect inputBoxShadow"
                        />
                      </div>
                    </div>
                    
                  </div>
                  <div className='mx-2'>
                    <p><strong>Devices</strong></p>
                  </div>
                  <div className='create-vehicle-wrapper add_vehicle'>
                    <div className="card-info-item card-inner">
                      <div className="label">
                        <p className='mx-3 lable_spacing'>
                          GPS IMEI
                        </p>
                      </div>
                      <div className="data">
                        <input type="text"
                          className='form-control addVehicleSelect'
                          autoComplete='off'
                          value={formData?.gps_imei}
                          onChange={(e) => {
                            onChange(e)
                          }}
                          name="gps_imei"
                          style={styles?.inputStyles} />
                      </div>
                      <span id="gps_device_serial_number_Span" style={{ position: 'absolute', opacity: '0', color: 'crimson' }}></span>
                    </div>
                    <div className="card-info-item card-inner">
                      <div className="label">
                        <p className='mx-3 lable_spacing'>
                          GPS Install Date
                        </p>
                      </div>
                      <div className="data">
                        <DatePicker
                          className='form-control addVehicleSelect input_feild'
                          clearIcon={null}
                          name="gps_device_install_date"
                          onChange={(e) => setFormData({ ...formData, gps_device_install_date: moment(e).format('MM/DD/yyyy') })}
                          format="MM/dd/yyyy"
                          value={formData?.gps_device_install_date && formData?.gps_device_install_date?.length > 0 ? new Date(formData?.gps_device_install_date) : ""}
                        />
                      </div>
                      <span id="gps_device_install_date_Span" style={{ position: 'absolute', opacity: '0', color: 'crimson' }}></span>
                    </div>
                    <div className="card-info-item card-inner">
                      <div className="label">
                        <p className='mx-3 lable_spacing'>
                          Battery Serial Number
                        </p>
                      </div>
                      <div className="data">
                        <input type='text'
                          className='form-control addVehicleSelect'
                          autoComplete='off'
                          value={formData?.battery_serial_number}
                          onChange={(e) => {
                            onChange(e)
                          }
                          }
                          name="battery_serial_number"
                          style={styles?.inputStyles} />
                      </div>
                      <span id="battery_serial_number_Span" style={{ position: 'absolute', opacity: '0', color: 'crimson' }}></span>
                    </div>
                    <div className="card-info-item card-inner">
                      <div className="label">
                        <p className='mx-3 lable_spacing' >
                          Battery Install Date
                        </p>
                      </div>
                      <div className="data">
                        <DatePicker
                          className='form-control addVehicleSelect input_feild'
                          clearIcon={null}
                          name="battery_install_date"
                          onChange={(e) => setFormData({ ...formData, battery_install_date: moment(e).format('MM/DD/yyyy') })}
                          format="MM/dd/yyyy"
                          value={formData?.battery_install_date && formData?.battery_install_date?.length > 0 ? new Date(formData?.battery_install_date) : ""}
                        />
                      </div>
                      <span id="battery_install_date_Span" style={{ position: 'absolute', opacity: '0', color: 'crimson' }}></span>
                    </div>
                    <div className="card-info-item card-inner">
                      <div className="label">
                        <p className='mx-3 lable_spacing'>
                          Lockbox Serial Number
                        </p>
                      </div>
                      <div className="data">
                        <input type="text"
                          className='form-control addVehicleSelect'
                          autoComplete='off'
                          value={formData?.lockbox_serial_number}
                          onChange={(e) => {
                            onChange(e)
                          }}
                          name="lockbox_serial_number"
                          style={styles?.inputStyles} />
                      </div>
                      <span id="lockbox_serial_number_Span" style={{ position: 'absolute', opacity: '0', color: 'crimson' }}></span>
                    </div>
                    <div className="card-info-item card-inner">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                          Lockbox Admin Code 
                          </p>
                        </div>
                        <div className="data">
                          <input type="text"
                            className='form-control addVehicleSelect'
                            autoComplete='off'
                            value={formData?.admin_passcode}
                            onChange={(e) => {
                              onChange(e)
                            }}
                            name="admin_passcode"
                            style={styles.inputStyles} />
                        </div>
                      </div>
                    <div className="card-info-item card-inner">
                      <div className="label">
                        <p className='mx-3 lable_spacing'>
                          LockBox Install Date
                        </p>
                      </div>
                      <div className="data">
                        <DatePicker
                          className='form-control addVehicleSelect input_feild'
                          clearIcon={null}
                          name="lockbox_install_date"
                          onChange={(e) => setFormData({ ...formData, lockbox_install_date: moment(e).format('MM/DD/yyyy') })}
                          format="MM/dd/yyyy"
                          value={formData?.lockbox_install_date && formData?.lockbox_install_date?.length > 0 ? new Date(formData?.lockbox_install_date) : ""}
                        />
                      </div>
                      <span id="lockbox_install_date_Span" style={{ position: 'absolute', opacity: '0', color: 'crimson' }}></span>
                    </div>
                  </div>
                  <div className='create_vehicle_inner'>
                    <div className='mx-2 mt-4'>
                      <p ><strong className='create-vehicle-heading'>Legal</strong></p>
                    </div>
                    <div className='create-vehicle-wrapper add_vehicle'>
                     
                
                      <div className="card-info-item card-inner">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            Title (Upload)
                          </p>
                        </div>
                        <div className="data">
                          <input type='file'
                            className='form-control addVehicleSelect choose_file'
                            autoComplete='off'
                            accept='.jpg,.jpeg,.png,.pdf'
                            name="title"
                            onChange={(e) => {
                              onDrop(e)
                            }}
                          />
                        </div>
                        <div className="imageGrid">
                          {formData?.titleImages && formData?.titleImages?.map((image, index) => {
                            if (image?.name?.substring(image?.name?.length - 3,) !== "pdf") {
                              return (
                                <React.Fragment key={index}>
                                  <img src={image?.imagePreviewUrl} alt="Documents" style={{ width: '200px', margin: '10px' }} />
                                  <div className='closeSpanDiv'>
                                    <span className='closeSpan'
                                      onClick={
                                        () => {
                                          formData?.titleImages?.splice(index, 1)
                                          setRefetch(!refetch)
                                          setFormData({
                                            ...formData,
                                            titleImages: formData?.titleImages
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
                                          formData?.titleImages?.splice(index, 1)
                                          setRefetch(!refetch)
                                          setFormData({
                                            ...formData,
                                            titleImages: formData?.titleImages
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
                        <span id="titleSpan" style={{ position: 'absolute', opacity: '0', color: 'crimson' }}></span>
                      </div>
                      <div className="card-info-item card-inner">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            Registration (Upload)
                          </p>
                        </div>
                        <div className="data">
                          <input type='file'
                            className='form-control addVehicleSelect choose_file'
                            autoComplete='off'
                            accept='.jpg,.jpeg,.png,.pdf'
                            name="uploadRegistrationCardImage"
                            onChange={(e) => {
                              onDrop(e)
                            }}
                          />
                        </div>
                        <div className="imageGrid">
                          {formData?.registrationImages && formData?.registrationImages?.map((image, index) => {
                            if (image?.name?.substring(image?.name?.length - 3,) !== "pdf") {
                              return (
                                <React.Fragment key={index}>
                                  <img src={image?.imagePreviewUrl} alt="Registration" style={{ width: '200px', margin: '10px' }} />
                                  <div className='closeSpanDiv'>
                                    <span className='closeSpan'
                                      onClick={
                                        () => {
                                          formData?.registrationImages?.splice(index, 1)
                                          setRefetch(!refetch)
                                          setFormData({
                                            ...formData,
                                            registrationImages: formData?.registrationImages
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
                                          formData?.registrationImages?.splice(index, 1)
                                          setRefetch(!refetch)
                                          setFormData({
                                            ...formData,
                                            registrationImages: formData?.registrationImages
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
                        <span id="uploadRegistrationCardImageSpan" style={{ position: 'absolute', opacity: '0', color: 'crimson' }}></span>
                      </div>
                      <div className="card-info-item card-inner ">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            Registration Expiration Date
                          </p>
                        </div>
                        <div className="data">
                          <DatePicker
                            className='form-control addVehicleSelect input_feild'
                            clearIcon={null}
                            name="registrationExpDate"
                            onChange={(e) => setFormData({ ...formData, registrationExpDate: moment(e).format('MM/DD/yyyy') })}
                            format="MM/dd/yyyy"
                            value={formData?.registrationExpDate && formData?.registrationExpDate?.length > 0 ? new Date(formData?.registrationExpDate) : ""}
                          />
                        </div>
                        <span id="registrationExpDateSpan" style={{ position: 'absolute', opacity: '0', color: 'crimson' }}></span>
                      </div>
                      <div className="card-info-item card-inner">
                        <div className="label">
                          <p className='mx-3 lable_spacing'>
                            QR Code (Upload)
                          </p>
                        </div>
                        <div className="data">
                          <input type='file'
                            className='form-control addVehicleSelect choose_file'
                            autoComplete='off'
                            accept='.jpg,.jpeg,.png,.pdf'
                            name="qrCodeImages"
                            onChange={(e) => {
                              onDrop(e)
                            }}
                          />
                        </div>
                        <div className="imageGrid">
                          {formData?.qrCodeImages && formData?.qrCodeImages?.map((image, index) => {
                            if (image?.name?.substring(image?.name?.length - 3,) !== "pdf") {
                              return (
                                <React.Fragment key={index}>
                                  <img src={image?.imagePreviewUrl} alt="Documents" style={{ width: '200px', margin: '10px' }} />
                                  <div className='closeSpanDiv'>
                                    <span className='closeSpan'
                                      onClick={
                                        () => {
                                          formData?.qrCodeImages?.splice(index, 1)
                                          setRefetch(!refetch)
                                          setFormData({
                                            ...formData,
                                            qrCodeImages: formData?.qrCodeImages
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
                                  <div onClick={() => openInNewTab(image?.imagePreviewUrl)} className="download-pdf">
                                    <strong>Download (PDF)</strong>
                                  </div>
                                  <div className='closeSpanDiv'>
                                    <span className='closeSpan'
                                      onClick={
                                        () => {
                                          formData?.qrCodeImages?.splice(index, 1)
                                          setRefetch(!refetch)
                                          setFormData({
                                            ...formData,
                                            qrCodeImages: formData?.qrCodeImages
                                          })
                                        }
                                      }
                                    >&times;</span>
                                  </div>
                                </React.Fragment>
                              )
                            }

                          })}
                        </div>
                        <span id="titleSpan" style={{ position: 'absolute', opacity: '0', color: 'crimson' }}></span>
                      </div>
                   
                  
                  
                    </div>
                  </div>
                  <form>
                    <div className="form-group" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                      <div>
                        <p className='pTagMarginLeft text-center'>Upload Moke Images</p>
                        <div className='dropzone'>
                          <Dropzone
                            onDrop={acceptedFiles => onDrop(acceptedFiles)}
                            maxSize={3145728}
                            minSize={1000}
                            onDropRejected={() => onDropRejected()}
                          >
                            {({ getRootProps, getInputProps }) => (
                              <section className='text-center' style={{
                                border: '1px dotted gray',
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '15px',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                              >
                                <div {...getRootProps()}>
                                  <input {...getInputProps()} />  <Icon
                                    icon='Upload'
                                    className='card-icon dark'
                                    style={{ height: '50px', width: '70px' }}
                                  />
                                  <p >Drag 'n' drop some files here, or click to select files</p>
                                </div>
                              </section>
                            )}
                          </Dropzone>
                        </div>
                      </div>
                    </div>
                    <div className="imageGrid">
                      {images && images?.images && images?.images?.map((image, index) => {
                        return (
                          <React.Fragment key={index}>
                            <img src={image?.imagePreviewUrl} alt="Vehicles" style={{ width: '200px', margin: '10px' }} />
                            <div className='closeSpanDiv'>
                              <span className='closeSpan'
                                onClick={
                                  () => {
                                    images?.images?.splice(index, 1)
                                    setRefetch(!refetch)
                                    setFormData({
                                      ...formData,
                                      vehicleImages: images?.images
                                    })
                                  }
                                }
                              >&times;</span>
                            </div>
                          </React.Fragment>
                        )
                      })}
                    </div>
                    <span className='text-danger danger-msg'>{(vehicleColorError || yearOfMakeError || partnerIdError || licensePlatesError || licensePlatesStateError || backseatColorError || backseatTypeError) && "Please fill out all required fields!"}</span>
                  </form >
                </div>
                <Button
                  className="mx-2 mt-3"
                  color='dark'
                  onClick={updateVehicle}>
                  Update
                </Button>
                <Button
                  className="mt-3"
                  color='danger'
                  onClick={() => navigate('/vehicles')}>
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

const styles = {
  dateInput: {
    boxShadow: 'rgb(116 116 116 / 53%) 0px 0px 1px 1px inset',
    lineHeight: '1.5',
    padding: "0.5rem 3rem 0.5rem 1rem",
    height: "3.5rem",
    color: '#323232',
  },
  onChangeColor: '#323232',
  inputStyles: {
    boxShadow: 'rgb(116 116 116 / 53%) 0px 0px 1px 1px inset',
    lineHeight: '1.5',
    padding: "0.5rem 3rem 0.5rem 1rem",
    height: "3.5rem"
  }
}

export default EditVehicle
