import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import moment from 'moment-timezone';
import _ from 'lodash';
import * as api from '../../../../api';
import Page from '../../../../layout/Page/Page';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Badge from '../../../../components/bootstrap/Badge';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../../../components/bootstrap/Card';
import { setAlert, setLoading } from '../../../../globalState/action-creators';

const DetailRevenue = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const tz = moment.tz.guess();

  const token = localStorage.getItem('token')
  useEffect(
    () => {
      if (!token) {
        navigate('/auth-pages/login', { replace: true })
      }
      fetchMoke(id)
      // eslint-disable-next-line
    }, []
  )

  // PARTNER DATA
  const [reservation, setReservation] = useState(null)
  const [checkInImages, setCheckInImages] = useState([])
  const [checkOutImages, setCheckOutImages] = useState([])
  console.log(reservation)

  const fetchMoke = async () => {
    dispatch(setLoading(true))
    try {
      const { data } = await api.getRevenueById(id)
      if (data?.success) {
        setReservation(data?.reservation)
        console.log(data?.reservation?.renter?.mokeImages, "<<data")
        setCheckInImages(data?.reservation?.renter?.mokeImages)
        setCheckOutImages(data?.reservation?.renter?.checkoutMokeImages)
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

  return (
    <PageWrapper title={'Detail'}>
      <Page container="fluid">
        <div className="row">
          <div className="col-xxl-6">
            <Card stretch>
              <CardHeader style={{ borderBottom: '1px solid gray' }}>
                <CardLabel >
                  <CardTitle tag="h4" className="h5">
                    Details
                  </CardTitle>
                </CardLabel>
              </CardHeader>
              <CardBody className="table-responsive">
                <div className="row">
                  <div className=".col-xl-4 col-md-4 col-sm-12 deatil-text">
                    <p><strong>Renter Name</strong></p>
                    <p>{_.get(reservation, 'renter.firstName', '')?.length > 0 ? _.get(reservation, 'renter.firstName', '') + " " + _.get(reservation, 'renter.lastName', '') : "NA"}</p>
                  </div>
                  <div className=".col-xl-4 col-md-4 col-sm-12 deatil-text">
                    <p><strong> Partner Name </strong></p>
                    <p>{_.get(reservation, 'partner.partnerName', '')?.length > 0 ? _.get(reservation, 'partner.partnerName', '') : "NA"}</p>
                  </div>
                  <div className=".col-xl-4 col-md-4 col-sm-12 deatil-text">
                    <p><strong> Vehicle Name</strong></p>
                    <p>{_.get(reservation, 'vehicle.vehicleName', '')?.length > 0 ? _.get(reservation, 'vehicle.vehicleName', '') + " " + `(${_.get(reservation, 'vehicle.licensePlates', '')})` : "NA"}</p>
                  </div>
                  {/* <div className=".col-xl-4 col-md-4 col-sm-12 deatil-text">
                    <p><strong>Start Date </strong></p>
                    <p>{_.get(reservation, 'bookingDate', '')?.length > 0 ? moment(_.get(reservation, 'bookingDate', '')).format("MM/DD/YYYY") : "NA"}</p>
                  </div>
                  <div className=".col-xl-4 col-md-4 col-sm-12 deatil-text">
                    <p><strong> End Date</strong></p>
                    <p>{_.get(reservation, 'bookingEndDate', '')?.length > 0 ? moment(_.get(reservation, 'bookingEndDate', '')).format("MM/DD/YYYY") : "NA"}</p>
                  </div>
                  <div className=".col-xl-4 col-md-4 col-sm-12">

                  </div>
                  <div className=".col-xl-4 col-md-4 col-sm-12 deatil-text">
                    <p><strong>Start Time </strong></p>
                    <p>{_.get(reservation, 'bookingTime', '')?.length > 0 ? _.get(reservation, 'bookingTime', '') : "NA"}</p>
                  </div>
                  <div className=".col-xl-4 col-md-4 col-sm-12 deatil-text">
                    <p><strong>End Time </strong></p>
                    <p>{_.get(reservation, 'bookingEndTime', '')?.length > 0 ? _.get(reservation, 'bookingEndTime', '') : "NA"}</p>
                  </div>
                  <div className=".col-xl-4 col-md-4 col-sm-12">

                  </div> */}
                  <div className=".col-xl-4 col-md-4 col-sm-12 deatil-text">
                    <p><strong>Booking Amount </strong></p>
                    <p>{_.get(reservation, 'bookingAmount', '')?.length > 0 ? `$${_.get(reservation, 'bookingAmount', '')}` : "NA"}</p>
                  </div>
                  <div className=".col-xl-4 col-md-4 col-sm-12 deatil-text">
                    <p><strong>Surcharge</strong></p>
                    <p>{_.get(reservation, 'surcharge', '')?.length > 0 ? `$${_.get(reservation, 'surcharge', '')}` : "NA"}</p>
                  </div>
                  <div className=".col-xl-4 col-md-4 col-sm-12 deatil-text">
                    <p><strong>State Tax</strong></p>
                    <p>{_.get(reservation, 'stateTax', '')?.length > 0 ? `$${_.get(reservation, 'stateTax', '')}` : "NA"}</p>
                  </div>
                  <div className=".col-xl-4 col-md-4 col-sm-12 deatil-text">
                    <p><strong>County Tax</strong></p>
                    <p>{_.get(reservation, 'countyTax', '')?.length > 0 ? `$${_.get(reservation, 'countyTax', '')}` : "NA"}</p>
                  </div>
                  <div className=".col-xl-4 col-md-4 col-sm-12 deatil-text">
                    <p><strong>Total Amount</strong></p>
                    <p>{_.get(reservation, 'subTotal', '')?.length > 0 ? `$${_.get(reservation, 'subTotal', '')}` : "NA"}</p>
                  </div>
                  <div className=".col-xl-4 col-md-4 col-sm-12 deatil-text">
                    <p><strong>Payment</strong></p>
                    <p className={_.get(reservation, 'payment.paid', '') === true ? "text-success" : "text-success"}>{_.get(reservation, 'payment.paid', '') === true ? "Succeeded" : "Succeeded"}</p>
                  </div>
                  <div className=".col-xl-4 col-md-4 col-sm-12 deatil-text">
                    <p><strong>Transaction ID</strong></p>
                    <p>{_.get(reservation, 'payment.charges.data[0].balance_transaction', '')?.length > 0 ? _.get(reservation, 'payment.charges.data[0].balance_transaction', '') : "NA"}</p>
                  </div>
                  <div className='.col-xl-4 col-md-4 col-sm-12 deatil-text'>
                    <p className='checktitle'><strong>Renter Signature</strong></p>
                    <div className='checking-scrollerwrapper'>
                      {_.get(reservation, 'renter.signature_image', '')?.length > 0 && _.get(reservation, 'renter.signature_image', '')?.map((image, index) => {
                        return <React.Fragment key={index}>
                          <div className='revenu-checkimg'><img src={image?.imagePreviewUrl} alt={image?.imagePreviewUrl} /></div>
                        </React.Fragment>
                      })
                      }
                    </div>
                  </div>
                  <div className='.col-xl-4 col-md-4 col-sm-12 deatil-text'>
                    {_.get(reservation, 'renter.florida_signature_image', '')?.length > 0 &&
                      <>
                        <p className='checktitle'><strong>Signature (Florida)</strong></p>
                        <div className='checking-scrollerwrapper'>
                          {_.get(reservation, 'renter.florida_signature_image', '')?.map((image, index) => {
                            return <React.Fragment key={index}>
                              <div className='revenu-checkimg'><img src={image?.imagePreviewUrl} alt={image?.imagePreviewUrl} /></div>
                            </React.Fragment>
                          })
                          }
                        </div>
                      </>
                    }
                  </div>
                  <div className='checkimg-wrapper'>

                    <p className='checktitle'><strong>Check In Images</strong></p>
                    <div className='checking-scrollerwrapper'>
                      {checkInImages?.length > 0 && checkInImages?.map((image, index) => {
                        return <React.Fragment key={index}>
                          <div className='revenu-checkimg'><img src={image?.imagePreviewUrl} alt={image?.imagePreviewUrl} /></div>
                        </React.Fragment>
                      })
                      }
                    </div>
                  </div>
                  <div className='checkimg-wrapper'>
                    <p className='checktitle'><strong>Check Out Images</strong></p>
                    <div className='checking-scrollerwrapper'>
                      {

                        checkOutImages?.length > 0 && checkOutImages?.map((image, index) => {

                          return <React.Fragment key={index}>
                            <div className='revenu-checkimg'> <img src={image?.imagePreviewUrl} alt={image?.imagePreviewUrl} /></div>
                          </React.Fragment>
                        })
                      }
                    </div>
                  </div>
                </div>
                {
                  _.get(reservation, 'status', '') === "Refunded" && <>
                  <h4>Refund details</h4>
                    <div className="row">
                      <div className=".col-xl-4 col-md-4 col-sm-12 deatil-text">
                        <p><strong>Refund Status</strong></p>
                        <p>{_.get(reservation, 'Refund.isRefunded', '') ? "Refunded": "NA"}</p>
                      </div>
                      <div className=".col-xl-4 col-md-4 col-sm-12 deatil-text">
                        <p><strong>Refund Amount</strong></p>
                        <p>{_.get(reservation, 'Refund.rAmount', '')?.length > 0 ? "$ " + _.get(reservation, 'Refund.rAmount', '') : "NA"}</p>
                      </div>
                      <div className=".col-xl-4 col-md-4 col-sm-12 deatil-text">
                        <p><strong>Refund Transaction ID</strong></p>
                        <p>{_.get(reservation, 'Refund.balance_transaction', '')?.length > 0 ? _.get(reservation, 'Refund.balance_transaction', '') : "NA"}</p>
                      </div>
                      <div className=".col-xl-4 col-md-4 col-sm-12 deatil-text">
                        <p><strong>Refund Reason</strong></p>
                        <p>{_.get(reservation, 'Refund.isReason', '')?.length > 0 ? _.get(reservation, 'Refund.isReason', '') : "NA"}</p>
                      </div>
                      <div className=".col-xl-4 col-md-4 col-sm-12 deatil-text">
                        <p><strong>Refund By</strong></p>
                        <p>{_.get(reservation, 'Refund.refundBy', '')?.length > 0 ? _.get(reservation, 'Refund.refundBy', '') : "NA"}</p>
                      </div>
                      <div className=".col-xl-4 col-md-4 col-sm-12 deatil-text">
                        <p><strong>Refund Date & Time</strong></p>
                        <p>{_.get(reservation, 'Refund.refundDate', '')?.length > 0 ? moment(_.get(reservation, 'Refund.refundDate', moment()?.toISOString()))?.tz(tz)?.format("MM-DD-YYYY hh:mm A") : "NA"}</p>
                      </div>
                    </div>
                  </>
                }
              </CardBody>
            </Card>
          </div>
        </div>
      </Page>
    </PageWrapper>
  )
}

export default DetailRevenue
