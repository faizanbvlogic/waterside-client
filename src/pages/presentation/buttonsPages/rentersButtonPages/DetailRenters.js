import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import * as api from '../../../../api';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../../../components/bootstrap/Card';
import Page from '../../../../layout/Page/Page';
import Button from '../../../../components/bootstrap/Button';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import { setAlert, setLoading } from '../../../../globalState/action-creators';

const DetailRenters = () => {
  let { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(
    () => {
      if (!token) {
        navigate('/auth-pages/login', { replace: true })
      }
      fetchRenter()
      // eslint-disable-next-line
    }, []
  )

  const [renterData, setRenterData] = useState({})

  const fetchRenter = async () => {
    dispatch(setLoading(true))
    try {
      const { data } = await api.getRenterById(id)
      if (data?.success) {
        console.log(data?.renter)
        setRenterData(data?.renter)
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

  const openInNewTab = url => {
    window.open(url, '_blank')
    // window.location.href = url
  };

  return (
    <PageWrapper title={"Renters Detail"}>
      <Page container="fluid">
        <div className='row'>
          <div className='col-xxl-6"'>
            <Card>
              <CardHeader>
                <CardLabel icon="Person" iconColor="primary">
                  <CardTitle tag="h4" className="h5">
                    User Profile
                  </CardTitle>
                </CardLabel>
              </CardHeader>
              <CardBody className="table-responsive">
                <div className='subContainerDetailView text-start'>
                  <div className='cardDetailView'>
                <p><strong>First Name</strong></p>
                <p>{_.get(renterData, "firstName", "")}</p>
                </div>
                <div className='cardDetailView'>
                <p><strong>Last Name</strong></p>
                <p>{_.get(renterData, "lastName", "")}</p>
                </div>
                <div className='cardDetailView'>
                <p><strong>DOB</strong></p>
                <p>{_.get(renterData, "dateOfBirth", "")}</p>
                </div>
                <div className='cardDetailView'>
                <p><strong>Phone Number</strong></p>
                <p>{_.get(renterData, "phoneNumber", "")}</p>
                </div>
                <div className='cardDetailView'>
                <p><strong>Email</strong></p>
                <p>{_.get(renterData, "email", "")}</p>
                </div>
                <div className='cardDetailView'>
                <p><strong>Home Address</strong></p>
                <p>{_.get(renterData, "street_address", "")}</p>
                </div>
                <div className='cardDetailView'>
                <p><strong>City</strong></p>
                <p>{_.get(renterData, "city", "")}</p>
                </div>
                <div className='cardDetailView'>
                <p><strong>State</strong></p>
                <p>{_.get(renterData, "state", "")}</p>
                </div>
                <div className='cardDetailView'>
                <p><strong>Zip Code</strong></p>
                <p>{_.get(renterData, "zipcode", "")}</p>
                </div>
                <div className='cardDetailView'>
                <p><strong>Billing Address</strong></p>
                <p>{_.get(renterData, "billing_address", "")}</p>
                </div>
                {/* <p>{_.get(renterData, "driver_license_images", "")}</p> */}
                <div className='cardDetailView'>
                <p><strong>License Expiration Date</strong> </p>
                <p>{_.get(renterData, "license_expiration_date", "")?.length > 0 ? moment(_.get(renterData, "license_expiration_date", "")).format("MM/DD/YYYY"): ""}</p>
                </div>
                <div className='cardDetailView'>
                <p><strong>Driver License Number</strong></p>
                <p>{_.get(renterData, "driver_license_number", "")}</p>
                </div>
                <div className='cardDetailView'>
                <p><strong>Insurance Company Name</strong></p>
                <p>{_.get(renterData, "rentel_info", "")}</p>
                </div>
                <div className='cardDetailView'>
                <p><strong>Driver License Image (Front)</strong></p>
               
                <div className='imagesPreview'>
                      {renterData && renterData?.driver_license_images && renterData?.driver_license_images?.length > 0 ?
                        renterData?.driver_license_images?.map((image, index) => {
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
                              </React.Fragment>
                            )
                          }
                        })
                        :
                        <p>-</p>
                      }

                    </div>
                    </div>
                <div className='cardDetailView'>
                <p><strong>Driver License Image (Back)</strong></p>
               
                <div className='imagesPreview'>
                      {renterData && renterData?.driver_license_back_images && renterData?.driver_license_back_images?.length > 0 ?
                        renterData?.driver_license_back_images?.map((image, index) => {
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
                              </React.Fragment>
                            )
                          }
                        })
                        :
                        <p>-</p>
                      }

                    </div>
                </div>
              
              
              
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </Page>
    </PageWrapper>
  )
}

export default DetailRenters


