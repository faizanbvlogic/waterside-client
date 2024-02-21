import React, { useEffect, useState } from 'react'
import * as api from '../../../api';
import _ from 'lodash'
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Pagination } from 'antd';
import Select from '../../../components/bootstrap/forms/Select';
import useSortableData from '../../../hooks/useSortableData';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page'
import Icon from '../../../components/icon/Icon';
import Badge from '../../../components/bootstrap/Badge';

import Card, {
  CardActions,
  CardBody,
  CardHeader,
  CardLabel,
  CardTitle,
} from '../../../components/bootstrap/Card';
import { setAlert, setLoading, setPartnerPreviewPage, setVehiclePreviewPage } from '../../../globalState/action-creators';

const Vehicles = () => {

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
  const [vehiclesData, setVehiclesData] = useState([])
  const [partnersData, setpartnersData] = useState([])
  const [partnerId, setpartnerId] = useState('')

  // FOR PAGINATION 
  const [paginationData, setPaginationData] = useState({ total: 0, currentPage: 1, pageSize: 10 })

  const { items, getClassNamesFor } = useSortableData(vehiclesData);

  const fetchPartners = async () => {
    dispatch(setLoading(true))
    try {
      const { data: { partners, success, message } } = await api.getPartners();
      if (success && partners && partners.length > 0) {
        setpartnerId(partners[0]._id)
        const optionArray = []
        partners && partners.map((partner, i) => {
          optionArray.push({ value: partner._id, text: partner.partnerName })
          return null
        })
        setpartnersData(optionArray)
        fetchVehiclesData(partners[0]._id)
      }
      else {
        dispatch(setAlert(message, "Error"))
      }
    } catch (error) {
      dispatch(setAlert(error.message, "Error"))
    };
    dispatch(setLoading(false))
  };

  const fetchVehiclesData = async (partnerId, isPage, isSize) => {
    const page = isPage || new URLSearchParams(search).get('page') || _.get(paginationData, 'currentPage', '1');
    const size = isSize || new URLSearchParams(search).get('size') || _.get(paginationData, 'pageSize', '10');
    try {
      const { data } = await api.getVehiclesByPartner({ partnerId: partnerId }, `page=${page}&size=${size}`);
      if (data.success) {
        setVehiclesData(_.get(data, "vehicles", { ...vehiclesData }))
        setPaginationData({ ...paginationData, total: data?.total, currentPage: page, pageSize: size })
      } else {
        dispatch(setAlert(data.message, "Error"))
      }
    } catch (error) {
      dispatch(setAlert(error.message, "Error"))
    };
  };

  const onChange = (e) => {
    const { value } = e.target;
    setpartnerId(value)
    fetchVehiclesData(value)
  };


  const onPageChanged = (page) => {
    fetchVehiclesData(partnerId, page)
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
                      Partner's Vehicles
                    </CardTitle>
                  </CardLabel>
                  <CardActions>
                    <Select
                      ariaLabel='Default select example'
                      placeholder=' '
                      // value=""
                      value={partnerId}
                      style={{ boxShadow: 'rgb(116 116 116 / 53%) 0px 0px 1px 1px inset' }}
                      name="partnerId"
                      onChange={(e) => { onChange(e) }}
                      list={partnersData}
                      className="addVehicleSelect inputBoxShadow"
                    />
                  </CardActions>
                </CardHeader>
                <CardBody className='table-responsive'>
                  <table className='table table-modern table-hover text-center'>
                    <thead>
                      <tr>
                        <th
                          scope='col'
                          // onClick={() => requestSort('id')}
                          className='cursor-pointer text-decoration-none'>
                          #{' '}
                          <Icon
                            size='lg'
                            className={getClassNamesFor('id')}
                            icon='FilterList'
                          />
                        </th>
                        <th
                          scope='col'
                          // onClick={() => requestSort('name')}
                          // className='cursor-pointer text-decoration-underline'>
                          className='cursor-pointer text-decoration-none'>
                          Name{' '}
                          <Icon
                            size='lg'
                            className={getClassNamesFor('name')}
                            icon='FilterList'
                          />
                        </th>
                        <th
                          scope='col'
                          // onClick={() => requestSort('licensePlates')}
                          // className='cursor-pointer text-decoration-underline'>
                          className='cursor-pointer text-decoration-none'>
                          License Plates{' '}
                          <Icon
                            size='lg'
                            className={getClassNamesFor('licensePlates')}
                            icon='FilterList'
                          />
                        </th>
                        <th scope='col'
                          className='cursor-pointer text-decoration-none'>
                          Vin{' '}
                          <Icon
                            size='lg'
                            className={getClassNamesFor('vin')}
                            icon='FilterList'
                          />
                        </th>
                        <th scope='col'
                          className='cursor-pointer text-decoration-none'>
                          GPS IMEI{' '}
                          <Icon
                            size='lg'
                            className={getClassNamesFor('gpsDeviceNumber')}
                            icon='FilterList'
                          />
                        </th>
                        <th
                          scope='col'
                          // onClick={() => requestSort('stock')}
                          // className='cursor-pointer text-decoration-underline'>
                          className='cursor-pointer text-decoration-none'>
                          Color{' '}
                          <Icon
                            size='lg'
                            className={getClassNamesFor('stock')}
                            icon='FilterList'
                          />
                        </th>
                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none'>
                          Backseat Type{' '}
                          <Icon
                            size='lg'
                            className={getClassNamesFor('device')}
                            icon='FilterList'
                          />
                        </th>
                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none'>
                          Backseat Color{' '}
                          <Icon
                            size='lg'
                            className={getClassNamesFor('status')}
                            icon='FilterList'
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items?.length > 0 && items?.map((i, index) => {
                        return <tr key={index} className="hover-bg">
                          <th scope='row'>{(paginationData?.pageSize * (paginationData?.currentPage - 1)) + index + 1}</th>
                          <td>
                            <strong>
                              {
                                _.get(i, "vehicleName", "")
                              }
                            </strong>
                          </td>
                          <td>
                            <div>
                              <p>{_.get(i, 'licensePlates', "")?.length > 0 ? _.get(i, 'licensePlates', "") : "-"}</p>
                            </div>
                          </td>
                          <td>
                            <p>{_.get(i, 'vin', "")?.length > 0 ? _.get(i, 'vin', "") : "-"}</p>
                          </td>
                          <td>
                            <p>{_.get(i, 'gps_imei', "")?.length > 0 ? _.get(i, 'gps_imei', "") : "-"}</p>
                          </td>
                          <td >
                            <div className='circle-color' style={{ backgroundColor: _.get(i, 'vehicleColor', ""), borderRadius: "50%", minHeight: '35px', minWidth: '35px', height: '35px', width: '35px' }} />
                          </td>
                          <td >
                            <p>{_.get(i, 'backseatType', "")?.length > 0 ? _.get(i, 'backseatType', "")?.charAt(0)?.toUpperCase() + _.get(i, 'backseatType', "")?.slice(1) : "-"}</p>
                          </td>
                          <td>
                            <Badge
                              shadow="lg"
                              style={{ color: i?.backseatColor === 'black' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', backgroundColor: _.get(i, 'backseatColor', "") }}
                            >
                              {i?.backseatColor?.charAt(0)?.toUpperCase() + i?.backseatColor?.slice(1)}
                            </Badge>
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
                  pageSize={_.get(paginationData, "pageSize", '10')}
                  defaultCurrent={1}
                  total={_.get(paginationData, "total", '0')}
                  showSizeChanger={false}
                />
              </Card>
            </div>
          </div>
        </Page>
      </PageWrapper>
    </>
  )
}

export default Vehicles