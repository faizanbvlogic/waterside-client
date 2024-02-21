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
import { US_STATES } from '../../../constants'

const DetailPartner = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tz = moment.tz.guess();

  // PARTNER DATA
  const [mokeData, setMokeData] = useState(null)

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
      const { data } = await api.getHoldMokeById(id)
      if (data.success) {
        setMokeData(data?.moke)
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
                <CardLabel icon="Person" iconColor="primary">
                  <CardTitle tag="h4" className="h5">
                    Hold Moke Details
                  </CardTitle>
                </CardLabel>
              </CardHeader>
              <CardBody className="table-responsive">
                {/* <div className='containerDetailView'> */}
                <div className='subContainerDetailView text-start'>
                	<div className='cardDetailView'>
                  	<p><strong>Moke</strong></p>
                    <p>{_.get(mokeData, 'vehicle.vehicleName', '-')}  {_.get(mokeData, "vehicle.licensePlates", "")}</p>
                  </div>
                  <div className='cardDetailView'>
                    <p><strong>Start Date</strong></p>
                    <p>{_.get(mokeData, 'startDate', '')?.length > 0 && moment(_.get(mokeData, 'startDate', '-')).format("MM/DD/YYYY")}</p>
                  </div>
									<div className='cardDetailView'>
                    <p><strong>End Date</strong></p>
                    <p>{_.get(mokeData, 'endDate', '-')?.length > 0 && moment(_.get(mokeData, 'endDate', '-'))?.format('MM/DD/YYYY')}</p>
                  </div>
									<div className='cardDetailView'>
                    <p><strong>Start Time</strong></p>
                    <p>{_.get(mokeData, 'startDate', '-')?.length > 0 && moment(_.get(mokeData, 'startDate', '-'))?.tz(tz)?.format('hh:mm A')}</p>
                  </div>
									<div className='cardDetailView'>
                    <p><strong>End Time</strong></p>
                    <p>{_.get(mokeData, 'endDate', '-')?.length > 0 && moment(_.get(mokeData, 'endDate', '-'))?.tz(tz)?.format('hh:mm A')}</p>
                  </div>
									<div className='cardDetailView'>
                    <p><strong>Reason</strong></p>
                    <p>{_.get(mokeData, 'reason', '-')}</p>
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
