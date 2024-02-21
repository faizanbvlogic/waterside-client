import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import * as api from '../../../api'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
// import Button from '../../../components/bootstrap/Button';
import Card, { CardActions, CardBody, CardHeader, CardLabel, CardTitle } from '../../../components/bootstrap/Card'
import Page from '../../../layout/Page/Page'
import PageWrapper from '../../../layout/PageWrapper/PageWrapper'
import { setLoading, setAlert, setPartnerPreviewPage, setVehiclePreviewPage } from '../../../globalState/action-creators';

const Rates = () => {
  // const Actions = [
  //   "Edit",
  // ];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = localStorage.getItem('token')
  useEffect(
    () => {
      if (!token) {
        navigate('/auth-pages/login', { replace: true })
      }
      dispatch(setPartnerPreviewPage({ partnerPage: 1 }))
      dispatch(setVehiclePreviewPage({ vehiclePage: 1 }))
      fetchRates()
      // eslint-disable-next-line
    }, []
  )
  // Rates data
  const [ratesData, setRatesData] = useState([])
  // const [editIndex, setEditIndex] = useState(null)
  // const [price, setPrice] = useState(null)
  // console.log(editIndex)

  const fetchRates = async () => {
    dispatch(setLoading(true))
    try {
      const { data } = await api.getRates();
      if (data.success) {
        setRatesData(_.get(data, 'rates', { ...ratesData }))
      }
      else {
        dispatch(setAlert(data.message, "Error"))
      }
    } catch (error) {
      dispatch(setAlert(error.message, "Error"))
    }
    dispatch(setLoading(false))
  };
  // useEffect(() => {
  //   console.log("work")
  // }, [editIndex])

  // async function updateRate(id) {
  //   dispatch(setLoading(true))
  //   try {
  //     const { data } = await api.defaultPriceUpdate(id, { price });
  //     if (data?.success) {
  //       dispatch(setAlert(data?.message, "Success"))
  //       fetchRates()
  //     }
  //     else {
  //       dispatch(setAlert(data?.message, "Error"))
  //       dispatch(setLoading(false))
  //     }
  //   }
  //   catch (error) {
  //     dispatch(setAlert(error?.message, "Error"))
  //     dispatch(setLoading(false))
  //   }
  // }

  return (
    <>
      <PageWrapper title="Rates">
        <Page container="fluid">
          <div className="row">
            <div className="col-xxl-6">
              <Card stretch>
                <CardHeader>
                  <CardLabel icon="Rates" iconColor="dark">
                    <CardTitle tag="h4" className="h5">
                      Rates
                    </CardTitle>
                  </CardLabel>
                  <CardActions>
                    <div>
                    </div>
                  </CardActions>
                </CardHeader>
                <CardBody className='table-responsive'>
                  <table className='table table-modern text-center'>
                    <thead>
                      <tr>
                        <th
                          scope='col'
                          className='text-decoration-none'>
                          #{' '}
                        </th>
                        <th
                          scope='col'
                          className='text-decoration-none'>
                          Name{' '}
                        </th>
                        <th
                          scope='col'
                          className='text-decoration-none'>
                          Type{' '}
                        </th>
                        <th
                          scope='col'
                          className='text-decoration-none'>
                          Price{' '}
                        </th>
                            {/* UNCOMMENT THIS IS YOU WANT DEFAULT RATES SHOULD BE EDITABLE */}
                        {/* <th
                          scope='col'
                          className='text-decoration-none'>
                          Actions
                        </th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {ratesData && ratesData?.length > 0 && ratesData?.map((i, index) => {
                        return <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>
                            <strong>
                              {i.name}
                            </strong>
                          </td>
                          <td>
                            <p>{i.type}</p>
                          </td>
                          {/* {
                            index === editIndex ?
                              <td>
                                <input type="text"
                                  value={price}
                                  onChange={e => setPrice(e?.target?.value)} />
                              </td>
                              :  */}
                              <td>
                                <p>
                                  <strong>
                                    ${i.price}
                                  </strong>
                                </p>
                              </td>
                          {/* } */}
                          {/* UNCOMMENT THIS IS YOU WANT DEFAULT RATES SHOULD BE EDITABLE */}
                          {/* 
                           <td>
                            {
                              Actions.map((e) => {
                                return <Button key={e}
                                  style={{ width: '36px', margin: '2px' }}
                                  color='primary'
                                  isLight
                                  icon={(editIndex === index && editIndex !== null) ? "Save" : e}
                                  onClick={() => {
                                    if (editIndex === index) {
                                      setEditIndex(null)
                                      console.log("Submit ", price)
                                      updateRate(i?._id)
                                    }
                                    else {
                                      setPrice(i?.price)
                                      setEditIndex(index)
                                    }
                                  }}
                                />
                              })
                            }
                          </td> */}
                        </tr>
                      })}
                    </tbody>
                  </table>
                </CardBody>
              </Card>
            </div>
          </div>
        </Page>
      </PageWrapper>
    </>
  )
}

export default Rates
