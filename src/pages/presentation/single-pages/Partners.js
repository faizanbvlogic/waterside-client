import React, { useEffect, useState } from 'react'
import _ from "lodash"
import * as api from '../../../api';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Pagination } from 'antd';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';

import Page from '../../../layout/Page/Page'
import Button from '../../../components/bootstrap/Button';
import Modal from '../../../utils/Modal';
import { setAlert, setLoading, setPartnerPreviewPage, setVehiclePreviewPage } from '../../../globalState/action-creators'

import Card, {
  CardActions,
  CardBody,
  CardHeader,
  CardLabel,
  CardTitle,
} from '../../../components/bootstrap/Card';

const Partners = () => {
  const Actions = [
    "Info",
    "Edit",
    "Delete"
  ];

  const previousPage = useSelector(state => state?.previousPage)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const search = useLocation().search;

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

  // vehicles data
  const [partnersData, setpartnersData] = useState([])

  // FOR PAGINATION 
  const [paginationData, setPaginationData] = useState({ total: 0, currentPage: 1, pageSize: 10 })

  // FOR MODAL TOGGLE
  const [isActiveModal, setIsActiveModal] = useState(false)
  const [partnerId, setpartnerId] = useState('')

  const fetchPartners = async (isPage, isSize) => {
    dispatch(setLoading(true))
    const page = isPage || previousPage?.partnerPage || new URLSearchParams(search).get('page') || _.get(paginationData, 'currentPage', '1');
    const size = isSize || new URLSearchParams(search).get('size') || _.get(paginationData, 'pageSize', '10');
    try {
      const { data } = await api.getPartners(`page=${page}&size=${size}`);
      if (data?.success) {
        setpartnersData(_.get(data, 'partners', { ...partnersData }))
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
    fetchPartners(page)
    dispatch(setPartnerPreviewPage({ partnerPage: page }))
  }

  const openDeleteModal = (partner) => {
    setpartnerId(partner._id)
    setIsActiveModal(true)

  }
  // for delete a partner
  const deletePartner = async () => {
    try {
      const { data } = await api.deletePartner(partnerId)
      if (data?.success) {
        fetchPartners(Math.ceil(
          (paginationData?.total - 1) / paginationData?.pageSize
        ))
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

  const detail = async (_id) => {
    navigate(`/partners/detail/${_id}`)
  }

  return (
    <>
      <PageWrapper title={"Vehicles"}>
        <Page container='fluid'>
          <div className="row">
            <div className='col-xxl-6'>
              <Card stretch>
                <CardHeader>
                  <CardLabel icon='Person' iconColor='dark'>
                    <CardTitle tag='h4' className='h5'>
                      Partners
                    </CardTitle>
                  </CardLabel>
                  <CardActions>
                    <Button
                      color='primary'
                      isLight
                      // icon='PublishedWithChanges'
                      icon='Plus'
                      onClick={() => {
                        navigate('/partners/create')
                      }}>
                      Add Partners
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
                          Partner name{' '}
                        </th>
                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none no_wrap'>
                          Contact person email{' '}

                        </th>
                        <th scope='col'
                          className='cursor-pointer text-decoration-none no_wrap'>
                          Contact person name {' '}

                        </th>
                        <th scope='col'
                          className='cursor-pointer text-decoration-none '>
                          Contact number{' '}
                        </th>
                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none partner-th '>
                          Address{' '}
                        </th>

                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none' >
                          Country{' '}

                        </th>
                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none'>
                          State{' '}

                        </th>
                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none'>
                          Zipcode{' '}

                        </th>
                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none notes-feild'>
                          Notes{' '}

                        </th>
                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none'>
                          Actions{' '}

                        </th>

                      </tr>
                    </thead>
                    <tbody>
                      {partnersData && partnersData?.length > 0 && partnersData?.map((data, index) => {
                        return <tr key={index} className="hover-bg" >
                          <th scope='row'>{(paginationData?.pageSize * (paginationData?.currentPage - 1)) + index + 1}</th>
                          <td >
                            <p>{_.get(data, 'partnerName', '')?.length > 0 ? _.get(data, 'partnerName', '') : "-"}</p>
                          </td>
                          <td>
                            <p>{_.get(data, 'email[0].email', '')?.length > 0 ? _.get(data, 'email[0].email', '') : "-"}</p>
                          </td>
                          <td>
                            <p>{_.get(data, 'contactPersonName[0].contactPersonName', '')?.length > 0 ? _.get(data, 'contactPersonName[0].contactPersonName', '') : "-"}</p>
                          </td>
                          <td>
                            <p>{_.get(data, 'contactNumber[0].contactNumber', '')?.length > 0 ? _.get(data, 'contactNumber[0].contactNumber', '') : "-"}</p>
                          </td>
                          <td className='max_address nowrap_td'>
                            <p>{_.get(data, 'address', '')?.length > 0 ? _.get(data, 'address', '') : "-"}</p>
                          </td>
                          <td>
                            <p>{_.get(data, 'country', '')?.length > 0 ? _.get(data, 'country', '') : "-"}</p>
                          </td>
                          <td>
                            <p>{_.get(data, 'state', '')?.length > 0 ? _.get(data, 'state', '') : "-"}</p>
                          </td>
                          <td>
                            <p>{_.get(data, 'zipcode', '')?.length > 0 ? _.get(data, 'zipcode', '') : "-"}</p>
                          </td>
                          <td>
                            <p>{_.get(data, 'notes', '')?.length > 0 ? _.get(data, 'notes', '') : "-"}</p>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                              {
                                Actions.map((e) => {
                                  return <Button key={e}
                                    style={{ width: '36px', margin: '2px' }}
                                    color='primary'
                                    isLight
                                    // icon='PublishedWithChanges'
                                    icon={e !== "Info" ? e : 'Eye'}
                                    onClick={() => {
                                      // e === "Info" && navigate(`/partners/detail/${data._id}`);
                                      e === "Info" && detail(data?._id)
                                      e === 'Delete' && openDeleteModal(data)
                                      e === 'Edit' && navigate(`/partners/edit/${data?._id}`);
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

                <Pagination
                  hideOnSinglePage
                  onChange={onPageChanged}
                  current={_.get(paginationData, "currentPage", '1')}
                  pageSize={_.get(paginationData, "pageSize", '5')}
                  defaultCurrent={1}
                  total={_.get(paginationData, "total", '0')}
                  showSizeChanger={false}
                />
              </Card>
            </div>
          </div>
        </Page>
      </PageWrapper>
      <Modal
        onSubmit={() => deletePartner()}
        onClose={() => setIsActiveModal(false)}
        show={isActiveModal}
        title={'Delete Partner!'}
      />
    </>
  )
}

export default Partners