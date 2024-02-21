import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import * as api from '../../../api'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import Select from '../../../components/bootstrap/forms/Select'
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, { CardActions, CardBody, CardHeader, CardLabel, CardTitle } from '../../../components/bootstrap/Card';
import { setAlert, setLoading, setVehiclePreviewPage, setPartnerPreviewPage } from '../../../globalState/action-creators';
import Button from '../../../components/bootstrap/Button';

const Actions = [
  "Edit"
]
const DAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat"
]
const ChangeRates = () => {
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
      fetchPartners()
      // eslint-disable-next-line
    }, []
  )

  // Rates data
  const [ratesData, setRatesData] = useState([])
  const [partnersData, setpartnersData] = useState([])
  const [partnerId, setpartnerId] = useState('')

  const fetchPartners = async (i) => {
    dispatch(setLoading(true))
    try {
      const { data: { partners, success, message } } = await api.getPartners();
      if (success && partners && partners?.length > 0) {
        setpartnerId(partners[0]._id)
        fetchRates(partners[0]._id)
        const optionArray = []
        partners && partners?.map((partner, index) => {
          optionArray.push({ value: partner._id, text: partner?.partnerName })
          return null
        })
        setpartnersData(optionArray)
      }
      else {
        dispatch(setAlert(message, "Error"))
      }
    } catch (error) {
      dispatch(setAlert(error.message, "Error"))
    }
    dispatch(setLoading(false))
  }

  // FETCH DYNAMIC RATES
  const fetchRates = async (id) => {
    try {
      const { data: { rates, success, message } } = await api.getDynamicRatesByPartner(id)
      if (success) {
        setRatesData(_.get(rates, 'rates', { ...ratesData }))
      }
      else {
        dispatch(setAlert(message, "Error"))
      }
    } catch (error) {
      dispatch(setAlert(error.message, "Error"))
    }
  }

  const onChange = (e) => {
    const { value } = e.target;
    setpartnerId(value)
    fetchRates(value)
  };

  const editRateByPartner = async (id, index) => {
    navigate(`/change_price/edit/${id}/${index}`)
  };

  return (
    <>
      <PageWrapper title="Change Rates">
        <Page container="fluid">
          <div className="row">
            <div className="col-xxl-6">
              <Card stretch>
                <CardHeader>
                  <CardLabel icon="Edit" iconColor="dark">
                    <CardTitle tag="h4" className="h5">
                      Change Rates
                    </CardTitle>
                  </CardLabel>
                  <CardActions>
                    <div>
                      <Select
                        ariaLabel='Default select example'
                        placeholder=' '
                        value={partnerId}
                        style={{ boxShadow: 'rgb(116 116 116 / 53%) 0px 0px 1px 1px inset' }}
                        name="partnerId"
                        onChange={(e) => { onChange(e) }}
                        list={partnersData}
                        className="addVehicleSelect inputBoxShadow"
                      />
                    </div>
                  </CardActions>
                </CardHeader>
                <CardBody className='table-responsive'>
                  {/* <table className='table table-modern table-hover text-center'> */}
                  <table className='table table-modern table-hover text-center'>
                    <thead>
                      <tr>
                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none changerate-data changerate-tr'>
                          #{' '}
                        </th>
                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none changerate-data changerate-tr'>
                          Name{' '}
                        </th>
                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none  btn_table changerate-data changerate-tr'>
                          Default Rate{' '}
                        </th>
                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none changerate-data changerateday perhourday changerate-tr'>
                          {' '}
                        </th>
                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none btn_table changerate-data changerate-tr'>
                          Rate {' '}
                        </th>
                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none btn_table changerate-data changerate-tr'>
                          {' '}
                        </th>
                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none btn_table changerate-data changerate-tr'>
                          {' '}
                        </th>
                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none btn_table changerate-data changerate-tr'>
                          {' '}
                        </th>
                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none btn_table changerate-data changerate-tr'>
                          {' '}
                        </th>
                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none btn_table changerate-data changerate-tr'>
                          Is Recurring{' '}
                        </th>
                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none changerate-data changerate-tr'>
                          Actions{' '}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {ratesData && ratesData?.length > 0 && ratesData?.map((i, index) => {
                        return index === 0 ?
                          <>
                            <tr className='change-rate-head'>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td className='changerate-tr'>Start Date</td>
                              <td className='changerate-tr'>End Date</td>
                              <td className='changerate-tr'>Start Time</td>
                              <td className='changerate-tr'>End Time</td>
                              <td></td>
                              <td></td>
                            </tr>
                            {
                              i?.hours && i?.hours?.length > 0 ?
                                i?.hours?.map((hour, ind) => {
                                  return <React.Fragment key={ind}>
                                    <tr className='changerates' key={index}>
                                      <th scope="row">{ind === 0 && index + 1}</th>
                                      <td className='btn_table'>
                                        <p>{ind === 0 && ratesData[index]?.name}</p>
                                      </td>
                                      <td >
                                        <p >
                                          <ul className='day_names '>
                                            <li className='select_day'>
                                              <p>{ind === 0 && `$${_.get(ratesData[index], "defaultPrice", "")}`}</p>
                                            </li>
                                          </ul>
                                        </p>
                                      </td>
                                      <td>
                                        <p>
                                          <ul className='day_names perhour '>
                                            <li className='select_day'>
                                              <div className='active day_namelist active'>
                                                {
                                                  (_.get(hour, "startTime", "")?.length > 0 && _.get(hour, "startDate", "")?.length > 0) ?
                                                    `${DAYS[new Date(_.get(hour, "startDate", "") + " " + _.get(hour, "startTime", ""))?.getDay()]} - ${DAYS[new Date(_.get(hour, "endDate", "") + " " + _.get(hour, "endTime", ""))?.getDay()]}`
                                                    : "-"
                                                }
                                              </div>
                                            </li>
                                          </ul>
                                        </p>
                                      </td>
                                      <td >
                                        <p>
                                          <ul className='day_names '>
                                            <li className='select_day'>
                                              <p>{_.get(hour, "price", "")?.length > 0 ? `$${_.get(hour, "price", "")}` : "-"}</p>
                                            </li>
                                          </ul>
                                        </p>
                                      </td>
                                      <React.Fragment >
                                        <td >
                                          <p>
                                            <ul className='day_names '>
                                              <li className='select_day'>
                                                <p>{_.get(hour, "startDate", "")?.length > 0 ? `${_.get(hour, "startDate", "")}` : "-"}</p>
                                              </li>
                                            </ul>
                                          </p>
                                        </td>
                                        <td >
                                          <p>
                                            <ul className='day_names '>
                                              <li className='select_day'>
                                                <p>{_.get(hour, "endDate", "")?.length > 0 ? `${_.get(hour, "endDate", "")}` : "-"}</p>
                                              </li>
                                            </ul>
                                          </p>
                                        </td>
                                        <td>
                                          <p>
                                            <ul className='day_names '>
                                              <li className='select_day'>
                                                <p>{_.get(hour, "startTime", "")?.length > 0 ? `${_.get(hour, "startTime", "")}` : "-"}</p>
                                              </li>
                                            </ul>
                                          </p>
                                        </td>
                                        <td >
                                          <p>
                                            <ul className='day_names '>
                                              <li className='select_day'>
                                                <p>{_.get(hour, "endTime", "")?.length > 0 ? `${_.get(hour, "endTime", "")}` : "-"}</p>
                                              </li>
                                            </ul>
                                          </p>
                                        </td>
                                      </React.Fragment>
                                      <td >
                                        <p>
                                          <ul className='day_names '>
                                            <p>{ind === 0 && (String(_.get(ratesData[index], "isRecurring", "")) === "true" ? "Yes" : "No")}</p>
                                          </ul>
                                        </p>
                                      </td>
                                      <td >
                                        {ind === 0 &&
                                          (Actions && Actions?.length > 0 && Actions.map((e) => {
                                            return <Button key={e}
                                              style={{ width: '50px', margin: '2px' }}
                                              color='primary'
                                              isLight
                                              icon={e !== "Info" ? e : 'Eye'}
                                              onClick={() => {
                                                e === 'Edit' && navigate(`/change_price/edit/per_hour/${partnerId}/${index}`)
                                              }} />
                                          }))
                                        }
                                      </td>
                                    </tr>
                                  </React.Fragment>
                                })
                                :
                                <React.Fragment>
                                  <tr className='changerates' key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td className='btn_table'>
                                      <p>{index === 0 && ratesData[index]?.name}</p>
                                    </td>
                                    <td >
                                      <p >
                                        <ul className='day_names '>
                                          <li className='select_day'>
                                            <p>{index === 0 && `$${_.get(ratesData[index], "defaultPrice", "")}`}</p>
                                          </li>
                                        </ul>
                                      </p>
                                    </td>
                                    <td >
                                      -
                                    </td>
                                    <td >
                                      -
                                    </td>
                                    <td>
                                      -
                                    </td>
                                    <td >
                                      -
                                    </td>
                                    <td >
                                      -
                                    </td>
                                    <td >
                                      -
                                    </td>
                                    <td >
                                      -
                                    </td>
                                    <td >
                                      {index === 0 &&
                                        (Actions && Actions?.length > 0 && Actions.map((e) => {
                                          return <Button key={e}
                                            style={{ width: '50px', margin: '2px' }}
                                            color='primary'
                                            isLight
                                            icon={e !== "Info" ? e : 'Eye'}
                                            onClick={() => {
                                              e === 'Edit' && navigate(`/change_price/edit/per_hour/${partnerId}/${index}`)
                                            }} />
                                        }))
                                      }
                                    </td>
                                  </tr>
                                </React.Fragment>
                            }
                          </>
                          :
                          (
                            index === 1 ?
                              <>
                                <tr className='change-rate-head'>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td className='changerate-tr'>Day</td>
                                  <td></td>
                                  <td className='changerate-tr'>Start Date</td>
                                  <td className='changerate-tr'>End Date</td>
                                  <td className='changerate-tr'>Start Time</td>
                                  <td className='changerate-tr'>End Time</td>
                                  <td></td>
                                  <td></td>
                                </tr>
                                <tr key={index} className='changerates'>
                                  <th class="changerate-data" scope="row">2</th>
                                  <td className='changerate-data btn_table'>
                                    <p>{ratesData[index]?.name || ""}</p>
                                  </td>
                                  <td className='changerate-data'>
                                    <p >
                                      ${_.get(ratesData[index], "defaultPrice", "")}
                                    </p>
                                  </td>
                                  <td className='changerate-data '>
                                    <p>
                                      <ul className='day_names '>
                                        <li className='select_day'>
                                          <div className=' day_namelist active'>
                                            Mon
                                          </div>
                                        </li>
                                        <li className='select_day'>
                                          <day className='day_namelist'>
                                            Tue
                                          </day>
                                        </li>
                                        <li className='select_day'>
                                          <day className='day_namelist'>
                                            wed
                                          </day>
                                        </li>
                                        <li className='select_day'>
                                          <div className='day_namelist'>
                                            Thu
                                          </div>
                                        </li>
                                        <li className='select_day'>
                                          <div className='day_namelist'>
                                            Fri
                                          </div>
                                        </li>
                                        <li className='select_day'>
                                          <div className='day_namelist'>
                                            Sat
                                          </div>
                                        </li>
                                        <li className='select_day'>
                                          <div className='day_namelist'>
                                            Sun
                                          </div>
                                        </li>
                                      </ul>
                                    </p>
                                  </td>
                                  <td className='changerate-data'>
                                    <p>
                                      <ul className='day_names '>
                                        <li className='select_day'>
                                          ${_.get(ratesData[index], "days.Monday", "")}
                                        </li>
                                        <li className='select_day'>
                                          ${_.get(ratesData[index], "days.Tuesday", "")}
                                        </li>
                                        <li className='select_day'>
                                          ${_.get(ratesData[index], "days.Wednesday", "")}
                                        </li>
                                        <li className='select_day'>
                                          ${_.get(ratesData[index], "days.Thursday", "")}
                                        </li>
                                        <li className='select_day'>
                                          ${_.get(ratesData[index], "days.Friday", "")}
                                        </li>
                                        <li className='select_day'>
                                          ${_.get(ratesData[index], "days.Saturday", "")}
                                        </li>
                                        <li className='select_day'>
                                          ${_.get(ratesData[index], "days.Sunday", "")}
                                        </li>
                                      </ul>
                                    </p>
                                  </td>
                                  <td className='changerate-data'>
                                    <p>
                                      {_.get(ratesData[index], "startDate", "")?.length > 0 ? _.get(ratesData[index], "startDate", "-") : "-"}
                                    </p>
                                  </td>
                                  <td className='changerate-data'>
                                    <p>
                                      {_.get(ratesData[index], "endDate", "-")?.length > 0 ? _.get(ratesData[index], "endDate", "-") : "-"}
                                    </p>
                                  </td>
                                  <td className='changerate-data'>
                                    <p>
                                      {_.get(ratesData[index], "startTime", "-")?.length > 0 ? _.get(ratesData[index], "startTime", "-") : "-"}
                                    </p>
                                  </td>
                                  <td className='changerate-data'>
                                    <p>
                                      {_.get(ratesData[index], "endTime", "-")?.length > 0 ? _.get(ratesData[index], "endTime", "-") : "-"}
                                    </p>
                                  </td>
                                  <td className='changerate-data'>
                                    <p>
                                      <ul className='day_names '>
                                        <li className='day_namelist'>{_.get(ratesData[index], "isRecurring", false) ? "Yes" : "No"} </li>

                                      </ul>
                                    </p>
                                  </td>
                                  <td className='changerate-data'>
                                    {
                                      Actions && Actions?.length > 0 && Actions.map((e) => {
                                        return <Button key={e}
                                          style={{ width: '50px', margin: '2px' }}
                                          color='primary'
                                          isLight
                                          icon={e !== "Info" ? e : 'Eye'}
                                          onClick={() => {
                                            e === 'Edit' && editRateByPartner(partnerId, index)
                                          }} />
                                      })
                                    }
                                  </td>
                                </tr>
                              </>
                              :
                              <>
                                <tr key={index} className="hover-bg">
                                  <th scope="row">{index + 1}</th>
                                  <td className='btn_table'>
                                    <p>{ratesData[index]?.name || ""}</p>
                                  </td>
                                  <td >
                                    <p>
                                      <p>{`$${_.get(ratesData[index], "defaultPrice", "")}`}</p>
                                    </p>
                                  </td>
                                  <td>
                                    <p>
                                    </p>
                                  </td>
                                  <td>
                                    <ul className='day_names '>
                                    </ul>
                                  </td>
                                  <td>
                                    <p>-</p>
                                  </td>
                                  <td>
                                    <p>-</p>
                                  </td>
                                  <td >
                                    <p>-</p>
                                  </td>
                                  <td >
                                    <p>-</p>
                                  </td>
                                  <td >
                                    <p>-</p>
                                  </td>
                                  <td >
                                    {
                                      Actions && Actions?.length > 0 && Actions.map((e) => {
                                        return <Button key={e}
                                          style={{ width: '50px', margin: '2px' }}
                                          color='primary'
                                          isLight
                                          icon={e !== "Info" ? e : 'Eye'}
                                          onClick={() => {
                                            e === 'Edit' && editRateByPartner(partnerId, index)
                                          }} />
                                      })
                                    }
                                  </td>
                                </tr>
                              </>
                          )
                      })
                      }
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

export default ChangeRates


