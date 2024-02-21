import React, { useEffect, useState } from 'react'
import _ from "lodash"
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

  // PARTNER DATA
  const [partnerData, setPartnerData] = useState(null)
  _.get(partnerData, 'email', '')?.length > 0 && _.get(partnerData, 'email', '')?.map((e) => e?.email)

  const token = localStorage.getItem('token')
  useEffect(
    () => {
      if (!token) {
        navigate('/auth-pages/login', { replace: true })
      }
      // eslint-disable-next-line
    }, []
  )

  const fetchPartner = async () => {
    dispatch(setLoading(true))
    try {
      const { data } = await api.getPartnerById(id)
      if (data.success) {
        setPartnerData(data?.partner)
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
    fetchPartner();
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
                    Partner Details
                  </CardTitle>
                </CardLabel>
              </CardHeader>
              <CardBody className="table-responsive">
                {/* <div className='containerDetailView'> */}
                <div className='subContainerDetailView text-start'>
                  <div className='cardDetailView'>
                    <p><strong>Partner name</strong></p>
                    <p>{_.get(partnerData, 'partnerName', '')?.length > 0 ? _.get(partnerData, 'partnerName', '') : "-"}</p>
                  </div>
                  <div className='cardDetailView'>
                    <p><strong>Address</strong></p>
                    <p>{_.get(partnerData, 'address', '')?.length > 0 ? _.get(partnerData, 'address', '') : "-"}</p>
                  </div>
                  <div className='cardDetailView'>
                    <p><strong>City</strong></p>
                    <p>{_.get(partnerData, 'city', '')?.length > 0 ? _.get(partnerData, 'city', '') : "-"}</p>
                  </div>
                  <div className='cardDetailView'>
                    <p><strong>State</strong></p>
                    <p>{_.get(partnerData, 'state', '')?.length > 0 ? _.get(partnerData, 'state', '') : "-"}</p>
                  </div>
                  <div className='cardDetailView'>
                    <p><strong>Zipcode</strong></p>
                    <p>{_.get(partnerData, 'zipcode', '')?.length > 0 ? _.get(partnerData, 'zipcode', '') : "-"}</p>
                  </div>
                  <div className='cardDetailView'>
                    <p><strong>Country</strong></p>
                    <p>{_.get(partnerData, 'country', '')?.length > 0 ? _.get(partnerData, 'country', '') : "-"}</p>
                  </div>
                  <div className='cardDetailView'>
                    <p><strong>Contact person name</strong></p>
                    {_.get(partnerData, 'contactPersonName', '')?.length > 0 &&
                      _.get(partnerData, 'contactPersonName', '')?.map((e, index) => <p key={index}>{e?.contactPersonName}</p>)}
                  </div>
                  <div className='cardDetailView'>
                    <p><strong>Contact person email</strong></p>
                    {_.get(partnerData, 'email', '')?.length > 0 &&
                      _.get(partnerData, 'email', '')?.map((e, index) => <p key={index}>{e?.email}</p>)}
                  </div>
                  <div className='cardDetailView'>
                    <p><strong>Contact number</strong></p>
                    {_.get(partnerData, 'contactNumber', '')?.length > 0 &&
                      _.get(partnerData, 'contactNumber', '')?.map((e, index) => <p key={index}>{e?.contactNumber}</p>)}
                  </div>
                  <div className='cardDetailView'>
                    <p><strong>Surcharge</strong></p>
                    {_.get(partnerData, "surcharge", "")?.length > 0 ?
                      (_.get(partnerData, "surchargeType", "") === "Daily" ?
                        <p>$ {_.get(partnerData, 'surcharge', '')} ({_.get(partnerData, "surchargeType", "")})</p>
                        :
                        <p>{_.get(partnerData, 'surcharge', '')}% </p>
                      )
                      : "-"
                    }
                  </div>
                  <div className='cardDetailView'>
                    <p><strong>State Tax</strong></p>
                    {_.get(partnerData, "stateTax", "")?.length > 0 ?
                      <p>{_.get(partnerData, 'stateTax', '')} %</p>
                      : "NA"
                    }
                  </div>
                  <div className='cardDetailView'>
                    <p><strong>County Tax</strong></p>
                    {_.get(partnerData, "countyTax", "")?.length > 0 ?
                      <p>{_.get(partnerData, 'countyTax', '')} %</p>
                      : "NA"
                    }
                  </div>
                  <div className='cardDetailView'>
                    <p><strong>Notes</strong></p>
                    <p>{_.get(partnerData, 'notes', '')?.length > 0 ? _.get(partnerData, 'notes', '') : "-"}</p>
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
