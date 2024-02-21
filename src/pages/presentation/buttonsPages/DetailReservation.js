import React, { useEffect, useState } from 'react'
import _ from "lodash"
import moment from 'moment-timezone';
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import * as api from '../../../api';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../../components/bootstrap/Card'
import Page from '../../../layout/Page/Page'
import PageWrapper from '../../../layout/PageWrapper/PageWrapper'
import { setAlert, setLoading } from '../../../globalState/action-creators';

const DetailPartner = () => {
    let { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const tz = moment.tz.guess();

    const [reservationData, setReservationData] = useState(null)

    const token = localStorage.getItem('token')
    useEffect(
        () => {
            if (!token) {
                navigate('/auth-pages/login', { replace: true })
            }
            // eslint-disable-next-line
        }, []
    )

    const fetchMoke = async () => {
        dispatch(setLoading(true))
        try {
            const { data } = await api.getReservationById(id)
            if (data.success) {
                setReservationData(data?.reservation)
            }
            else {
                dispatch(setAlert(data?.message, "Error"))
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

    useEffect(() => {
        fetchMoke();
        // eslint-disable-next-line
    }, [])
    return (
        <PageWrapper title={'Detail'}>
            <Page container="fluid">
                <div className="row">
                    <div className="col-xxl-6">
                        <Card stretch>
                            <CardHeader style={{ borderBottom: '1px solid gray' }}>
                                <CardLabel icon="reservation" iconColor="primary">
                                    <CardTitle tag="h4" className="h5">
                                        Reservation Details
                                    </CardTitle>
                                </CardLabel>
                            </CardHeader>
                            <CardBody className="table-responsive">
                                {/* <div className='containerDetailView'> */}
                                <div className='subContainerDetailView text-start'>
                                    <div className='cardDetailView'>
                                        <p><strong>Partner</strong></p>
                                        <p>{_.get(reservationData, 'partner.partnerName', '-')}</p>
                                    </div>
                                    <div className='cardDetailView'>
                                        <p><strong>Vehicle</strong></p>
                                        <p>{_.get(reservationData, 'vehicle.vehicleName', '-')}  {_.get(reservationData, "vehicle.licensePlates", "")}</p>
                                    </div>
                                    <div className='cardDetailView'>
                                        <p><strong>Renter</strong></p>
                                        <p>{_.get(reservationData, 'renter.firstName', '-')}  {_.get(reservationData, "renter.lastName", "")}</p>
                                    </div>
                                    <div className='cardDetailView'>
                                        <p><strong>Booking Type</strong></p>
                                        <p>{_.get(reservationData, 'bookingMethod', '-')}</p>
                                    </div>
                                    <div className='cardDetailView'>
                                        <p><strong>Start Date</strong></p>
                                        <p>{_.get(reservationData, 'bookingDate', '')?.length > 0 && moment(_.get(reservationData, 'bookingDate', '-')).format("MM/DD/YYYY")}</p>
                                    </div>
                                    <div className='cardDetailView'>
                                        <p><strong>End Date</strong></p>
                                        <p>{_.get(reservationData, 'bookingEndDate', '-')?.length > 0 && moment(_.get(reservationData, 'bookingEndDate', '-'))?.format('MM/DD/YYYY')}</p>
                                    </div>
                                    <div className='cardDetailView'>
                                        <p><strong>Start Time</strong></p>
                                        <p>{_.get(reservationData, 'bookingDate', '-')?.length > 0 && moment(_.get(reservationData, 'bookingDate', '-'))?.tz(tz)?.format('hh:mm A')}</p>
                                    </div>
                                    <div className='cardDetailView'>
                                        <p><strong>End Time</strong></p>
                                        <p>{_.get(reservationData, 'bookingEndDate', '-')?.length > 0 && moment(_.get(reservationData, 'bookingEndDate', '-'))?.tz(tz)?.format('hh:mm A')}</p>
                                    </div>
                                    <div className='cardDetailView'>


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

export default DetailPartner
