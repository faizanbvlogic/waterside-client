import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import * as api from '../../../api';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Pagination } from 'antd';
import useSortableData from '../../../hooks/useSortableData';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page'
import Button from '../../../components/bootstrap/Button';
import Badge from '../../../components/bootstrap/Badge';
import { dataPagination, PER_COUNT } from '../../../components/PaginationButtons';
import Card, { CardActions, CardBody, CardHeader, CardLabel, CardTitle } from '../../../components/bootstrap/Card';
import { setAlert, setLoading, setVehiclePreviewPage, setPartnerPreviewPage } from '../../../globalState/action-creators';
import Modal from '../../../utils/Modal';

const Vehicles = () => {
  const Actions = [
    "Info",
    "Edit",
    "Delete"
  ];

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
      fetchVehiclesData()
      // eslint-disable-next-line
    }, []
  )

  const [refetch, setRefetch] = useState(false)
  // vehicles data
  const [vehiclesData, setVehiclesData] = useState([])
  const [partnerData, setPartnerData] = useState(null)

  const previousPage = useSelector(state => state?.previousPage)
  console.log(previousPage)

  // FOR PAGINATION 
  const [paginationData, setPaginationData] = useState({ total: 0, currentPage: 1, pageSize: 10 })

  // FOR MODAL TOGGLE
  const [isActiveModal, setIsActiveModal] = useState(false)
  const [modalRemoveBuildData, setModalRemoveBuildData] = useState(null)

  const [currentPage,
    setCurrentPage
  ] = useState(1);
  const [perPage,
    // eslint-disable-next-line
    setPerPage
  ] = useState(PER_COUNT[paginationData?.pageSize || "10"]);

  const { items } = useSortableData(vehiclesData);

  const fetchVehiclesData = async (isPage, isSize) => {
    dispatch(setLoading(true))
    try {
      const page = isPage || previousPage?.vehiclePage || new URLSearchParams(search).get('page') || _.get(paginationData, 'currentPage', '1');
      const size = isSize || new URLSearchParams(search).get('size') || _.get(paginationData, 'pageSize', '5');
      const { data } = await api.getVehicles(`page=${page}&size=${size}`);
      if (data.success) {
        setVehiclesData(_.get(data, 'vehicles', { ...vehiclesData }))
        setPartnerData(_.get(data, 'partners', { ...partnerData }))
        setPaginationData({ ...paginationData, total: data?.total, currentPage: page, pageSize: size })
      }
      else {
        dispatch(setAlert(data.message, "Error"))
      }
    } catch (error) {
      dispatch(setAlert(error.message, "Error"))
    };
    dispatch(setLoading(false))
  };

  const onPageChanged = (page) => {
    fetchVehiclesData(page)
    dispatch(setVehiclePreviewPage({ vehiclePage: page }))
  }

  // FOR EDIT A VEHICLE
  const editVehicle = async ({ id }) => {
    navigate(`/vehicles/edit/${id}`);
  };

  const deleteVehicle = async ({ id, vehicleName }) => {
    setModalRemoveBuildData({
      id,
      vehicleName
    })
    setIsActiveModal(true);
  };
  // for delete a vehicle
  const deleteVehicleOnModalSubmit = async (id) => {
    try {
      const { data } = await api.deleteVehicleOnModal(id)
      if (data?.success) {
        setIsActiveModal(false)
        setRefetch(!refetch)
        setCurrentPage(
          Math.ceil(
            (items?.length - 1) / perPage
          )
        )
        fetchVehiclesData()
        dispatch(setAlert(data.message, "Success"))
      } else {
        dispatch(setAlert(data.message, "Error"))
      }
    } catch (error) {
      dispatch(setAlert(error.message, "Error"))
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
                  <CardLabel icon='Vehicle' iconColor='dark'>
                    <CardTitle tag='h4' className='h5'>
                      Vehicles
                    </CardTitle>
                  </CardLabel>
                  <CardActions>
                    <Button
                      color='primary'
                      isLight
                      icon='Plus'
                      onClick={() => {
                        navigate('/Vehicles/create')
                      }}>
                      Add Units
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
                          className='cursor-pointer text-decoration-none'>
                          Unit Number{' '}
                        </th>
                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none'>
                          Renter{' '}
                        </th>
                        <th scope='col'
                          className='cursor-pointer text-decoration-none'>
                          Start Date{' '}
                        </th>
                        <th scope='col'
                          className='cursor-pointer text-decoration-none'>
                          Allowed Vehicles{' '}
                        </th>
                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none'>
                          Driveway Space{' '}
                        </th>
                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none'>
                          Street Parking Space{' '}
                        </th>
                        <th
                          scope='col'
                          className='cursor-pointer text-decoration-none'>
                          Zones{' '}
                        </th>
                      
                      </tr>
                    </thead>
                    <tbody>
                      {items?.length > 0 && dataPagination(items, currentPage, perPage).map((i, index) => {
                        return <tr key={index} className="changerates" >
                          <th scope='row'>{(perPage * (paginationData?.currentPage - 1)) + index + 1}</th>
                          <td>
                            <strong>
                              {_.get(i, "vehicleName", "Moke")}
                            </strong>
                          </td>
                          <td>
                            <div>
                              <p>{_.get(i, "licensePlates", "")?.length > 0 ? _.get(i, "licensePlates", "") : "-"}</p>
                            </div>
                          </td>
                          <td>
                            <p>{_.get(i, "vin", "")?.length > 0 ? _.get(i, "vin", "") : "-"}</p>
                          </td>
                          <td>
                            <p>{_.get(i, "gps_imei", "")?.length > 0 ? _.get(i, "gps_imei", "") : "-"}</p>
                          </td>
                          <td>
                            <div style={{ backgroundColor: _.get(i, 'vehicleColor', ""), borderRadius: "50%", minHeight: '35px', minWidth: '35px', height: '35px', width: '35px' }} />
                            <p>{_.get(i, "vehicleColor", "")?.length < 0 && "-"}</p>
                          </td>
                          <td style={{ minWidth: '150px' }}>
                            <p>{_.get(i, "partner.partnerName", "NA")}</p>
                          </td>
                          <td>
                            {/* {i?.backseatType?.charAt(0)?.toUpperCase() + i?.backseatType?.slice(1)} */}
                            <p>{_.get(i, "backseatType", "")?.length > 0 ? _.get(i, "backseatType", "")?.charAt(0)?.toUpperCase() + _.get(i, "backseatType", "")?.slice(1) : "-"}</p>
                          </td>
                          <td>
                            <Badge
                              shadow="lg"
                              style={{ color: i?.backseatColor === 'black' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', backgroundColor: `${i?.backseatColor}` }}
                            >
                              {i?.backseatColor?.charAt(0)?.toUpperCase() + i?.backseatColor?.slice(1)}
                            </Badge>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                              {
                                Actions && Actions?.length > 0 && Actions.map((e) => {
                                  return <Button key={e}
                                    style={{ width: '36px', margin: '2px' }}
                                    color='primary'
                                    isLight
                                    icon={e !== "Info" ? e : 'Eye'}
                                    onClick={() => {
                                      e === "Info" && navigate(`/vehicles/detail/${i?._id}`);
                                      e === 'Delete' && deleteVehicle({ id: i?._id, vehicleName: _.get(i, 'vehicleName', "") })
                                      e === 'Edit' && editVehicle(
                                        {
                                          id: i._id,
                                        }
                                      )
                                    }} />
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

      <Modal
        onSubmit={
          () => modalRemoveBuildData !== null &&
            deleteVehicleOnModalSubmit(modalRemoveBuildData?.id)
        }

        onClose={
          () => setIsActiveModal(false)
        }

        show={isActiveModal}

        title={
          modalRemoveBuildData !== null && modalRemoveBuildData?.vehicleName ?
            `Delete :  ${modalRemoveBuildData?.vehicleName}!`
            :
            'Delete Moke!'
        } />
    </>
  )
}

export default Vehicles