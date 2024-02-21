import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import * as api from '../../../api';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment-timezone';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page'
import Button from '../../../components/bootstrap/Button';
import Card, { CardActions, CardBody, CardHeader, CardLabel, CardTitle } from '../../../components/bootstrap/Card';
import { setAlert, setLoading, setVehiclePreviewPage, setPartnerPreviewPage } from '../../../globalState/action-creators';
import Modal from '../../../utils/Modal';

const HoldMokeDashboard = () => {
  const Actions = [
    "Info",
    "Edit",
    "Delete"
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const search = useLocation().search;
  const tz = moment.tz.guess();

  const token = localStorage.getItem('token')
  useEffect(
    () => {
      if (!token) {
        navigate('/auth-pages/login', { replace: true })
      }
      dispatch(setPartnerPreviewPage({ partnerPage: 1 }))
      dispatch(setVehiclePreviewPage({ vehiclePage: 1 }))
      fetchMokeData()
      // eslint-disable-next-line
    }, []
  )

  // vehicles data
  const [vehicleData, setVehicleData] = useState([])
  // FOR MODAL TOGGLE
  const [isActiveModal, setIsActiveModal] = useState(false)
  const [mokeId, setMokeId] = useState('')

  // FOR PAGINATION 
  const [paginationData, setPaginationData] = useState({ total: 0, currentPage: 1, pageSize: 10 })

  const fetchMokeData = async (isPage, isSize) => {
    dispatch(setLoading(true))
    const page = isPage || new URLSearchParams(search).get('page') || _.get(paginationData, 'currentPage', '1');
    const size = isSize || new URLSearchParams(search).get('size') || _.get(paginationData, 'pageSize', '10');
    try {
      const { data } = await api.getAllHoldMoke( "",`page=${page}&size=${size}`);
      if (data?.success) {
        setVehicleData(_.get(data, 'vehicles', { ...vehicleData }))
        setPaginationData({ ...paginationData, total: data?.total || paginationData?.total, currentPage: page, pageSize: size })
      }
      else {
        dispatch(
          setAlert(
            data?.message,
            "Error"
          )
        )
      }
    } catch (error) {
      dispatch(
        setAlert(
          error?.message,
          "Error"
        )
      )
    };
    dispatch(setLoading(false))
  };

  const onPageChanged = (page) => {
    fetchMokeData(page)
  }
  const detail = async (_id) => {
    navigate(`/hold_moke/detail/${_id}`)
  }

  const openDeleteModal = (data) => {
    setMokeId(data._id)
    setIsActiveModal(true)
  }

  // for delete a moke
  const deleteHoldMoke = async () => {
    try {
      const { data } = await api.deleteHoldMoke(mokeId)
      if (data?.success) {
        fetchMokeData()
        setIsActiveModal(false)
      }
      else {
        dispatch(
          setAlert(
            data?.message,
            "Error"
          )
        )
      }
    } catch (error) {
      dispatch(
        setAlert(
          error?.message,
          "Error"
        )
      )
    }
  }

  return (
    <>
      <PageWrapper title={"Vehicles"}>
        <Page container='fluid'>
          <div className="row">
            <div className='col-xxl-6'>
              <Card stretch>
                <CardHeader>
                  <CardLabel icon='HoldMoke' iconColor='dark'>
                    <CardTitle tag='h4' className='h5'>
                      Hold Moke
                    </CardTitle>
                  </CardLabel>
                  <CardActions>
                    <Button
                      color='primary'
                      isLight
                      // icon='PublishedWithChanges'
                      icon='Plus'
                      onClick={() => {
                        navigate('/hold_moke/add')
                      }}>
                      Add Moke
                    </Button>
                  </CardActions>
                </CardHeader>
                <CardBody className='table-responsive'>
                  <table className='table table-modern table-hover text-center'>
                    <thead>
                      <tr>
                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none'>
                          #{' '}
                        </th>
                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none partner-th'>
                          Moke{' '}
                        </th>
                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none no_wrap'>
                          Start Date{' '}

                        </th>
                        <th scope='col'
                          className='cursor-pointer text-decoration-none no_wrap'>
                          End Date {' '}

                        </th>
                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none no_wrap'>
                          Start Time{' '}

                        </th>
                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none no_wrap'>
                          End Time{' '}

                        </th>
                        <th scope='col'
                          className='cursor-pointer text-decoration-none '>
                          Reason{' '}
                        </th>
                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none'>
                          Actions{' '}

                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicleData && vehicleData?.length > 0 && vehicleData?.map((data, index) => {
                        return <tr key={index} className="hover-bg" >
                          <th scope='row'>{(paginationData?.pageSize * (paginationData?.currentPage - 1)) + index + 1}</th>
                          <td >
                            <p>{_.get(data, 'vehicle.vehicleName', '')?.length > 0 ? _.get(data, 'vehicle.vehicleName', '') + " " + _.get(data, "vehicle.licensePlates", "") : "-"}</p>
                          </td>
                          <td>
                            <p>{_.get(data, 'startDate', '')?.length > 0 ? moment(_.get(data, 'startDate', ''))?.tz(tz).format("MM/DD/YYYY") : "-"}</p>
                          </td>
                          <td>
                            <p>{_.get(data, 'endDate', '')?.length > 0 ? moment(_.get(data, 'endDate', ''))?.tz(tz).format('MM/DD/YYYY') : "-"}</p>
                          </td>
                          <td>
                            <p>{_.get(data, 'startDate', '')?.length > 0 ? moment(_.get(data, 'startDate', ''))?.tz(tz).format('hh:mm A') : "-"}</p>
                          </td>
                          <td>
                            <p>{_.get(data, 'endDate', '')?.length > 0 ? moment(_.get(data, 'endDate', ''))?.tz(tz).format('hh:mm A') : "-"}</p>
                          </td>
                          <td>
                            <p>{_.get(data, 'reason', '')?.length > 0 ? _.get(data, 'reason', '') : "-"}</p>
                          </td>
                          <td>
                            <div className='action-td'>
                              {
                                Actions.map((e) => {
                                  return <Button key={e}
                                    style={{ width: '36px', margin: '2px' }}
                                    color='primary'
                                    isLight
                                    // icon='PublishedWithChanges'
                                    icon={e !== "Info" ? e : 'Eye'}
                                    onClick={() => {

                                      e === "Info" && detail(data?._id)
                                      e === 'Delete' && openDeleteModal(data)
                                      e === 'Edit' && navigate(`/hold_moke/edit/${data?._id}`);
                                    }}
                                  />
                                })
                              }
                            </div>
                          </td>

                        </tr>
                      }
                      )
                      }
                    </tbody>
                  </table>
                </CardBody>

                {/* <Pagination
                                    hideOnSinglePage
                                    onChange={onPageChanged}
                                    current={_.get(paginationData, "currentPage", '1')}
                                    pageSize={_.get(paginationData, "pageSize", '5')}
                                    defaultCurrent={1}
                                    total={_.get(paginationData, "total", '0')}
                                    showSizeChanger={false}
                                /> */}
              </Card>
            </div>
          </div>
        </Page>
      </PageWrapper>
      <Modal
        onSubmit={() => deleteHoldMoke()}
        onClose={() => setIsActiveModal(false)}
        show={isActiveModal}
        title={'Delete Partner!'}
      />
    </>
  )
}

export default HoldMokeDashboard