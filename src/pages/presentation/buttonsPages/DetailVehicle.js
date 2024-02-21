import React, { useEffect, useState } from 'react'
import _ from 'lodash';
import * as api from '../../../api'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../../components/bootstrap/Button';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../../components/bootstrap/Card'
import { setAlert, setLoading } from '../../../globalState/action-creators'
import Page from '../../../layout/Page/Page'
import PageWrapper from '../../../layout/PageWrapper/PageWrapper'

// import { Viewer, Worker } from '@react-pdf-viewer/core'
// import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
// import '@react-pdf-viewer/core/lib/styles/index.css'
// import '@react-pdf-viewer/default-layout/lib/styles/index.css'
// import pdf from '../../../1.pdf'

const DetailVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const [vehicle, setVehicle] = useState({

  })

  const token = localStorage.getItem('token')
  useEffect(
    () => {
      if (!token) {
        navigate('/auth-pages/login', { replace: true })
      }

      fetchVehicle(id)
      // eslint-disable-next-line
    }, []
  )

  const fetchVehicle = async (id) => {
    dispatch(setLoading(true))
    try {
      const { data } = await api.detailVehicle(id);
      if (data?.success) {
        setVehicle(_.get(data, 'vehicle', { ...vehicle }))
      }
      else {
        dispatch(setAlert(data?.message, "Error"))
      }
    } catch (error) {
      dispatch(setAlert(error?.message, "Error"))
    }
    dispatch(setLoading(false))
  }
  const openInNewTab = url => {
    window.open(url, '_blank')
    // window.location.href = url
  };

  return (
    <PageWrapper title={'Detail'}>
      <Page container="fluid">
        <div className="row">
          <div className="col-xxl-6">
            <Card stretch>
              <CardHeader style={{ borderBottom: '1px solid gray' }}>
                <CardLabel icon="Vehicle" iconColor="primary">
                  <CardTitle tag="h4" className="h5">
                    Vehicle Details
                  </CardTitle>
                </CardLabel>
              </CardHeader>
              <CardBody className="table-responsive">
                {/* <div className='containerDetailView'> */}
                  <div className='subContainerDetailView text-start'>
                    <div className='cardDetailView'>
                      <p><strong>Name</strong></p>
                      <p>{_.get(vehicle, "vehicleName", "")?.length > 0 ? _.get(vehicle, "vehicleName", "Moke") : "-"}</p>
                    </div>
                    <div className='cardDetailView'>
                      <p><strong>Vehicle Color</strong></p>
                      <p style={{ display: 'flex', alignItems: 'center' }}>
                        {_.get(vehicle, "vehicleColor", "")?.length > 0 ? _.get(vehicle, "vehicleColor", "") : "-"}
                        <span style={{ backgroundColor: vehicle?.vehicleColor, width: '20px', height: '20px', borderRadius: '50%', marginLeft: '5px' }}></span>
                      </p>
                    </div>
                    <div className='cardDetailView'>
                      <p><strong>Year Of Make</strong></p>
                      <p>{_.get(vehicle, "yearOfMake", "")?.length > 0 ? _.get(vehicle, "yearOfMake", "") : "-"}</p>
                    </div>

{/*                
                  <div className='subContainerDetailView text-start'> */}
                    <div className='cardDetailView'>
                      <p><strong>Partner</strong></p>
                      <p>{_.get(vehicle, "partner.partnerName", "")?.length > 0 ? _.get(vehicle, "partner.partnerName", "") : "-"}</p>
                    </div>
                    <div className='cardDetailView'>
                      <p><strong>Backseat Type</strong></p>
                      <p>{_.get(vehicle, "backseatType", "")?.length > 0 ? _.get(vehicle, "backseatType", "") : "-"}</p>
                    </div>
                    <div className='cardDetailView'>
                      <p><strong>Backseat Color</strong></p>
                      <p>{_.get(vehicle, "backseatColor", "")?.length > 0 ? _.get(vehicle, "backseatColor", "") : "-"}</p>
                    </div>
                  {/* </div> */}
                  {/* <div className='subContainerDetailView text-start'> */}
                    <div className='cardDetailView'>
                      <p><strong>GPS IMEI Number</strong></p>
                      <p>{_.get(vehicle, "gps_imei", "")?.length > 0 ? _.get(vehicle, "gps_imei", "") : "-"}</p>
                    </div>
                    <div className='cardDetailView'>
                      <p><strong>GPS Install Date</strong></p>
                      <p>{_.get(vehicle, "gps_device_install_date", "")?.length > 0 ? _.get(vehicle, "gps_device_install_date", "") : "-"}</p>
                    </div>
                    <div className='cardDetailView'>
                      <p><strong>Battery Serial Number</strong></p>
                      <p>{_.get(vehicle, "battery_serial_number", "")?.length > 0 ? _.get(vehicle, "battery_serial_number", "") : "-"}</p>
                    </div>
                  {/* </div>
                  <div className='subContainerDetailView text-start'> */}
                    <div className='cardDetailView'>
                      <p><strong>Battery Install Date</strong></p>
                      <p>{_.get(vehicle, "battery_install_date", "")?.length > 0 ? _.get(vehicle, "battery_install_date", "") : "-"}</p>
                    </div>
                    <div className='cardDetailView'>
                      <p><strong>Lockbox Serial Number</strong></p>
                      <p>{_.get(vehicle, "lockbox_serial_number", "")?.length > 0 ? _.get(vehicle, "lockbox_serial_number", "") : "-"}</p>
                    </div>
                    <div className='cardDetailView'>
                      <p><strong>Lockbox Admin Code</strong></p>
                      <p>{_.get(vehicle, "admin_passcode", "")?.length > 0 ? _.get(vehicle, "admin_passcode", "") : "-"}</p>
                    </div>
                    <div className='cardDetailView'>
                      <p><strong>LockBox Install Date</strong></p>
                      <p>{_.get(vehicle, "lockbox_install_date", "")?.length > 0 ? _.get(vehicle, "lockbox_install_date", "") : "-"}</p>
                    </div>
                  {/* </div>
                  <div className='subContainerDetailView text-start'> */}
                    <div className='cardDetailView'>
                      <p><strong>License Plate Number</strong></p>
                      <p>{_.get(vehicle, "licensePlates", "")?.length > 0 ? _.get(vehicle, "licensePlates", "") : "-"}</p>
                    </div>
                    <div className='cardDetailView'>
                      <p><strong>License Plates State</strong></p>
                      <p>{_.get(vehicle, "licensePlatesState", "")?.length > 0 ? _.get(vehicle, "licensePlatesState", "") : "-"}</p>
                    </div>
                    <div className='cardDetailView'>
                      <p><strong>Vin</strong></p>
                      <p>{_.get(vehicle, "vin", "")?.length > 0 ? _.get(vehicle, "vin", "") : "-"}</p>
                    </div>
      
                    <div className='cardDetailView'>
                      <p><strong>Registration Expiration Date</strong></p>
                      <p>{_.get(vehicle, "registrationExpDate", "")?.length > 0 ? _.get(vehicle, "registrationExpDate", "") : "-"}</p>
                    </div>
                
                  <div className='text-start image_wrapper'>
                    {/* <div className="imageGrid"> */}
                    <p><strong>Title Images</strong></p>
                    <div className='imagesPreview'>
                      {vehicle && vehicle?.titleImages && vehicle?.titleImages?.length > 0 ?
                        vehicle?.titleImages?.map((image, index) => {
                          if (image?.imagePreviewUrl?.substring(image?.imagePreviewUrl?.length - 3,) !== "pdf") {
                            return (
                              <React.Fragment key={index}>
                                <img src={image?.imagePreviewUrl} alt="Documents" style={{ width: '200px' }} />
                              </React.Fragment>
                            )
                          }
                          else {
                            return (
                              <React.Fragment key={index}>
                                <Button
                                  className="mt-3"
                                  color='dark'
                                  icon="Download"
                                  isLight
                                  onClick={() => openInNewTab(image?.imagePreviewUrl)}>
                                  Download PDF
                                </Button>

                                {/* <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js"> */}
                                {/* <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.14.305/build/pdf.worker.min.js">
                                  <div style={{ height: "720px" }}>
                                    <Viewer fileUrl={pdf} plugins={[defaultLayoutPluginInstance]} />
                                    <Viewer fileUrl={image?.imagePreviewUrl} plugins={[defaultLayoutPluginInstance]} />
                                  </div>
                                </Worker> */}
                              </React.Fragment>
                            )
                          }
                        })
                        :
                        <p>-</p>
                      }

                    </div>
                    {/* </div> */}
                  </div>
                  <div className='text-start image_wrapper'>
                    {/* <div className="imageGrid"> */}
                    <p><strong>Registration Images</strong></p>
                    <div className='imagesPreview'>
                      {vehicle && vehicle?.registrationImages && vehicle?.registrationImages?.length > 0 ?
                        vehicle?.registrationImages?.map((image, index) => {
                          if (image?.imagePreviewUrl?.substring(image?.imagePreviewUrl?.length - 3,) !== "pdf") {
                            return (
                              <React.Fragment key={index}>
                                <img src={image?.imagePreviewUrl} alt="Registration" style={{ width: '200px' }} />
                              </React.Fragment>
                            )
                          }
                          else {
                            return (
                              <React.Fragment key={index}>
                                <Button
                                  className="mt-3"
                                  color='dark'
                                  isLight
                                  icon="Download"
                                  onClick={() => openInNewTab(image?.imagePreviewUrl)}>
                                  Download PDF
                                </Button>
                              </React.Fragment>
                            )
                          }
                        })
                        :
                        <p>-</p>
                      }
                    </div>
                    {/* </div> */}
                  </div>
                  <div className='text-start image_wrapper'>
                    {/* <div className="imageGrid"> */}
                    <p><strong>QR Code Images</strong></p>
                    <div className='imagesPreview'>
                      {vehicle && vehicle?.qrCodeImages && vehicle?.qrCodeImages?.length > 0 ?
                        vehicle?.qrCodeImages?.map((image, index) => {
                          if (image?.imagePreviewUrl?.substring(image?.imagePreviewUrl?.length - 3,) !== "pdf") {
                            return (
                              <React.Fragment key={index}>
                                <img src={image?.imagePreviewUrl} alt="Documents" style={{ width: '200px' }} />
                              </React.Fragment>
                            )
                          }
                          else {
                            return (
                              <React.Fragment key={index}>
                                <Button
                                  className="mt-3"
                                  color='dark'
                                  icon="Download"
                                  isLight
                                  onClick={() => openInNewTab(image?.imagePreviewUrl)}>
                                  Download PDF
                                </Button>

                                {/* <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js"> */}
                                {/* <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.14.305/build/pdf.worker.min.js">
                                  <div style={{ height: "720px" }}>
                                    <Viewer fileUrl={pdf} plugins={[defaultLayoutPluginInstance]} />
                                    <Viewer fileUrl={image?.imagePreviewUrl} plugins={[defaultLayoutPluginInstance]} />
                                  </div>
                                </Worker> */}
                              </React.Fragment>
                            )
                          }
                        })
                        :
                        <p>-</p>
                      }

                    </div>
                    {/* </div> */}
                  </div>
                  <div className=' text-start image_wrapper'>
                    {/* <div className="imageGrid"> */}
                    <p><strong>Moke Images</strong></p>
                    <div className='imagesPreview'>
                      {vehicle && vehicle?.vehicleImages && vehicle?.vehicleImages?.length > 0 ?
                        vehicle?.vehicleImages?.map((image, index) => {
                          return (
                            <React.Fragment key={index}>
                              <img src={image?.imagePreviewUrl} alt="Vehicles" style={{ width: '200px' }} />
                            </React.Fragment>
                          )
                        })
                        :
                        <p>-</p>
                      }
                    </div>
                    {/* </div> */}
                  </div>
                </div>
                {/* </div> */}
              </CardBody>
            </Card>
          </div>
        </div>
      </Page>
    </PageWrapper>
  )
}

export default DetailVehicle
