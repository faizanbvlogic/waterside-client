import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment-timezone';
import DatePicker from 'react-date-picker'
import * as api from '../../../api';
import { Pagination } from 'antd';
import Modal from '../../../utils/Modal';
import { USER_ROLE } from "../../../constants"
import chatIcon from "../../../assets/img/chat.svg"
import { setAlert, setLoading, setPartnerPreviewPage, setVehiclePreviewPage } from '../../../globalState/action-creators';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page'
import Button, { ButtonGroup } from '../../../components/bootstrap/Button';
import Badge from '../../../components/bootstrap/Badge';
import Card, {
  CardActions,
  CardBody,
  CardHeader,
  CardLabel,
  CardTitle,
} from '../../../components/bootstrap/Card';
import MessageChat from './chat-icons/MessageChat';
import Chat from "./chat-icons/Chat";

const Reservation = () => {
  const Actions = [
    "Info",
    "Edit",
    "Delete",
    "Avoid",
    "Refund",
    "Complete"
  ];

  const tz = moment.tz.guess();
  console.log(tz, "timezone dashboard")

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const search = useLocation().search;
  const user = useSelector(state => state?.user);
  const token = localStorage.getItem('token')
  useEffect(() => {
    if (!token) {
      navigate('/auth-pages/login', { replace: true })
    }
    dispatch(setPartnerPreviewPage({ partnerPage: 1 }))
    dispatch(setVehiclePreviewPage({ vehiclePage: 1 }))

    fetchReservations()

    //eslint-disable-next-line
  }, [])

  const [reservations, setReservations] = useState([]);
  console.log(reservations)

  // FOR MODAL TOGGLE
  const [isActiveModal, setIsActiveModal] = useState(false)
  const [isModalForAvoid, setIsModalForAvoid] = useState(false)
  const [reservationId, setReservationId] = useState('')

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false)
  const [isNoteSectionOpen, setIsNoteSectionOpen] = useState(null)
  const [textnotes, setNotes] = useState("")
  //REFUND MODAL
  // const [isRefundModalActive, setIsRefundModalActive] = useState(false)
  // FOR DATE FILTER
  const [dateFilter, setDateFilter] = useState(false)
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()

  // FOR PAGINATION 
  const [paginationData, setPaginationData] = useState({ total: 0, currentPage: 1, pageSize: 10, filter: "all" })
  console.log(paginationData?.filter)

  const fetchReservations = async (isPage, isFilter, isSize, startDate, endDate, isDateFilter) => {
    dispatch(setLoading(true))
    const page = isPage || new URLSearchParams(search).get('page') || _.get(paginationData, 'currentPage', '1');
    const size = isSize || new URLSearchParams(search).get('size') || _.get(paginationData, 'pageSize', '10');
    const filter = isFilter || new URLSearchParams(search).get('filter') || _.get(paginationData, 'filter', 'all');
    const startDate_ = new Date(moment(startDate).add('days', 1).format()).toISOString()
    const endDate_ = new Date(moment(endDate).add('days', 1).format()).toISOString()

    try {
      const { data } = (user?.role === USER_ROLE?.PARTNER &&
        await api.getPartnersReservations(user?.id, `page=${page}&size=${size}&filter=${filter}${isDateFilter ? `&isDateFilter=${isDateFilter}` : ""}${startDate_ && endDate_ && startDate_?.length > 0 && endDate_?.length > 0 ? `&startDate=${startDate_}&endDate=${endDate_}` : ""}`)) ||
        ((user?.role === USER_ROLE?.SUPER_ADMIN || user?.role === USER_ROLE?.ADMIN) &&
          await api.getAllReservations(`page=${page}&size=${size}&filter=${filter}${isDateFilter ? `&isDateFilter=${isDateFilter}` : ""}${startDate_ && endDate_ && startDate_?.length > 0 && endDate_?.length > 0 ? `&startDate=${startDate_}&endDate=${endDate_}` : ""}`))
      if (data?.success) {
        setReservations(_.get(data, "reservations", [...reservations]));
        setPaginationData({ ...paginationData, total: data?.total || paginationData?.total, currentPage: page, pageSize: size, filter: filter })
      }
      else {
        setReservations([]);
        setPaginationData({ ...paginationData, total: data?.total || paginationData?.total })
        // dispatch(setAlert(data?.message, "Error"))
      }
    } catch (error) {
      dispatch(setAlert(error?.message, "Error"))
    }
    dispatch(setLoading(false))
  }

  const onPageChanged = (page, isFilter) => {
    console.log(dateFilter, "<<<<date filter")
    fetchReservations(page, isFilter, 10, startDate, endDate, ((startDate || endDate) ? true : false) /* datefilter value */)
  }

  function toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
  }

  const openDeleteModal = (reservation, isAvoid) => {
    setReservationId(reservation?._id)
    setIsActiveModal(true)
    setIsModalForAvoid(isAvoid)
  }

  const openCompleteModal = (id) => {
    setReservationId(id)
    setIsCompleteModalOpen(true)
  }
  // const openRefundModal = id => {
  //   setReservationId(id)
  //   setIsRefundModalActive(true)
  // }
  // for delete a partner
  const deletePartner = async () => {
    try {
      const { data } = await api.deleteReservation(reservationId)
      if (data?.success) {
        // fetchPartners(Math.ceil(
        //   (paginationData?.total - 1) / paginationData?.pageSize
        // ))
        fetchReservations(1, "all")
        setIsActiveModal(false)
      }
      else {
        setIsActiveModal(false)
        dispatch(
          setAlert(
            data?.message,
            "Error"
          )
        )
      }
    } catch (error) {
      setIsActiveModal(false)
      dispatch(
        setAlert(
          error?.message,
          "Error"
        )
      )
    }
  }

  // AVOID RESERVATION
  const avoidReservation = async () => {
    try {
      const { data } = await api.avoidReservation(reservationId)
      if (data?.success) {
        // fetchReservations(1, "all")
        setIsActiveModal(false)
        dispatch(setAlert(data?.message, "Success"))
      }
      else {
        setIsActiveModal(false)
        dispatch(setAlert(data?.message, "Error"))
      }
    } catch (error) {
      setIsActiveModal(false)
      dispatch(setAlert(error?.message, "Error"))
    }
  }

  // REFUND BOOKING AMOUNT
  // async function refund () {
  //   try {
  //     const { data } = await api.refund(reservationId)
  //     if (data?.success) {
  //       // fetchReservations(1, "all")
  //       setIsRefundModalActive(false)
  //       dispatch(setAlert(data?.message, "Success"))
  //     }
  //     else {
  //       setIsRefundModalActive(false)
  //       dispatch(setAlert(data?.message, "Error"))
  //     }
  //   } catch (error) {
  //     setIsRefundModalActive(false)
  //     dispatch(setAlert(error?.message, "Error"))
  //   }
  // }

  const handleOnChange = (value, name) => {
    console.log(Date.now() + (1000 * 60 * 60 * 24))
    console.log(name)
    // if (startDate && endDate) {
    //   console.log("1")
    //   if (new Date(startDate).getTime() === new Date(endDate).getTime()) {
    //     console.log("2")
    //     fetchReservations(1, "date", 10, new Date(startDate).toISOString(), (new Date(new Date(endDate).getTime() + (1000 * 60 * 60 * 24)).toISOString()))
    //   }
    //   else {
    //     console.log("3")
    //     fetchReservations(1, "date", 10, new Date(startDate).toISOString(), new Date(endDate).toISOString())
    //   }
    // }
    if (name === "startDate" && endDate) {
      console.log("4")
      fetchReservations(1, paginationData?.filter, 10, (value).toISOString(), new Date(endDate).toISOString(), true)
    }
    else if (name === "endDate" && startDate) {
      console.log("5")
      if (new Date(startDate).getTime() === new Date(value).getTime()) {
        fetchReservations(1, paginationData?.filter, 10, new Date(startDate).toISOString(), (new Date(new Date(value).getTime() + (1000 * 60 * 60 * 24)).toISOString()), true)
      }
      else {
        fetchReservations(1, paginationData?.filter, 10, new Date(startDate).toISOString(), (value).toISOString(), true)
      }
    }
    else if (name === "endDate" && (!startDate || startDate?.length <= 0)) {
      console.log("6")
      if (new Date(value).getTime() > new Date().getTime()) {
        fetchReservations(1, paginationData?.filter, 10, (new Date()).toISOString(), (value).toISOString(), true)
      }
      else {
        fetchReservations(1, paginationData?.filter, 10, (value).toISOString(), (value).toISOString(), true)
      }
    }
    else if (name === "startDate" && (!endDate || endDate?.length <= 0)) {
      console.log("7")
      fetchReservations(1, paginationData?.filter, 10, (value).toISOString(), (new Date(new Date(value).getTime() + (1000 * 60 * 60 * 24)).toISOString()), true)
    }
    else {
      console.log("else work")
    }
  };

  const onCompleteHandle = async () => {
    try {
      const { data } = await api.markCompleteReservation(reservationId)
      if (data?.success) {
        setIsCompleteModalOpen(false)
        dispatch(setAlert(data?.message, "Success"))
      }
      else {
        setIsCompleteModalOpen(false)
        dispatch(setAlert(data?.message, "Error"))
      }
    } catch (error) {
      setIsCompleteModalOpen(false)
      dispatch(setAlert(error?.message, "Error"))
    }
  }

  const addNotesInReservation = async reservationId => {
    console.log(reservationId)
    dispatch(setLoading(true))
    try {
      const { data } = await api.addNotesInReservation(reservationId, { textnotes });
      if (data?.success) {
        // navigate("/reservation", { replace: true });
        fetchReservations()
        dispatch(setAlert(data?.message, "Success"));
      }
      else {
        dispatch(setAlert(data?.message, "Error"))
      }
    }
    catch (error) {
      dispatch(setAlert(error?.message, "Error"))
    }
    dispatch(setLoading(false))
  }

  return (
    <>
      <PageWrapper title={"Reservations"}>
        <Page container='fluid'>
          <div className='row'>
            <div className='col-xxl-6'>
              <Card stretch>
                <CardHeader>
                  <CardLabel icon='Reservation' iconColor='dark'>
                    <CardTitle tag='h4' className='h5'>
                      Reservations
                    </CardTitle>
                  </CardLabel>
                  <CardActions>
                    <ButtonGroup
                      className={"btn-group"}
                      // isToolbar={true}
                      isVertical={false}
                      size={'sm'}
                      ariaLabel={String}
                    >
                      <Button color='dark' isLight onClick={() => {
                        setPaginationData({
                          ...paginationData,
                          filter: "all"
                        })
                        setStartDate("")
                        setEndDate("")
                        setDateFilter(false)
                        fetchReservations(1, "all")
                      }}>All</Button>
                      <Button color='dark' isLight onClick={() => {
                        setPaginationData({
                          ...paginationData,
                          filter: "hourly"
                        })
                        setStartDate("")
                        setEndDate("")
                        setDateFilter(false)
                        fetchReservations(1, "hourly")
                      }}>Hourly</Button>
                      <Button color='dark' isLight onClick={() => {
                        setPaginationData({
                          ...paginationData,
                          filter: "daily"
                        })
                        setStartDate("")
                        setEndDate("")
                        setDateFilter(false)
                        fetchReservations(1, "daily")
                      }}>Daily</Button>
                      <Button color='dark' isLight
                        onClick={() => {
                          setPaginationData({
                            ...paginationData,
                            filter: "weekly"
                          })
                          setStartDate("")
                          setEndDate("")
                          setDateFilter(false)
                          fetchReservations(1, "weekly")
                        }} >Weekly</Button>
                      <Button color='dark' isLight onClick={() => alert("Under development")}>Monthly</Button>
                    </ButtonGroup>
                  </CardActions>
                </CardHeader>
                <CardActions>
                  <div className='card-info-item card-inner card-height picker-box'>
                    <p className="editrate-text lable_spacing">End Date</p>
                    <DatePicker
                      className='form-control addVehicleSelect input_feild picker-reservation'
                      clearIcon={null}
                      name="endDate"
                      disabled={!!!startDate}
                      minDate={startDate ? new Date(startDate) : ""}
                      onChange={(e) => {
                        setEndDate(new Date(e)?.toISOString())
                        handleOnChange(e, "endDate")
                      }}
                      format="MM/dd/yyyy"
                      value={endDate ? new Date(endDate) : ""}
                    />
                  </div>
                  <div className='card-info-item card-inner card-height picker-box'>
                    <p className="editrate-text lable_spacing">Start Date </p>
                    <DatePicker
                      className='form-control addVehicleSelect input_feild picker-reservation'
                      clearIcon={null}
                      name="startDate"
                      maxDate={endDate ? new Date(endDate) : ""}
                      onChange={(e) => {
                        setStartDate(new Date(e)?.toISOString())
                        handleOnChange(e, "startDate")
                      }}
                      format="MM/dd/yyyy"
                      value={startDate ? new Date(startDate) : ""}
                    />
                  </div>
                </CardActions>
                <CardBody className='table-responsive reservation-wrapper'>
                  <React.Fragment>
                    <table className='table table-modern table-hover text-center'>
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="cursor-pointer text-decoration-none">
                            #{' '}
                          </th>
                          <th
                            scope="col"
                            className="cursor-pointer text-decoration-none no_wrap">
                            Renter Name{' '}
                          </th>
                          <th
                            scope="col"
                            className="cursor-pointer text-decoration-none no_wrap">
                            Partner Name{' '}
                          </th>
                          <th
                            scope="col"
                            className="cursor-pointer text-decoration-none">
                            Moke Number{' '}
                          </th>
                          <th
                            scope="col"
                            className="cursor-pointer text-decoration-none">
                            Timezone{' '}
                          </th>
                          <th
                            scope="col"
                            className="cursor-pointer text-decoration-none">
                            Start Date{' '}
                          </th>
                          <th
                            scope="col"
                            className="cursor-pointer text-decoration-none">
                            End Date{' '}
                          </th>
                          <th
                            scope="col"
                            className="cursor-pointer text-decoration-none no_wrap">
                            Start Time{' '}
                          </th>
                          <th
                            scope="col"
                            className="cursor-pointer text-decoration-none no_wrap">
                            End Time{' '}
                          </th>
                          {/* <th
                            scope="col"
                            className="cursor-pointer text-decoration-none">
                            Transaction Id{' '}
                          </th> */}
                          {
                            (user?.role === USER_ROLE?.ADMIN || user?.role === USER_ROLE?.SUPER_ADMIN) &&
                            <>
                              <th
                                scope="col"
                                className="cursor-pointer text-decoration-none">
                                Booking Amount{' '}
                              </th>
                              <th
                                scope="col"
                                className="cursor-pointer text-decoration-none">
                                Surcharge{' '}
                              </th>
                              <th
                                scope="col"
                                className="cursor-pointer text-decoration-none">
                                State Tax{' '}
                              </th>
                              <th
                                scope="col"
                                className="cursor-pointer text-decoration-none">
                                County Tax{' '}
                              </th>
                            </>
                          }
                          <th
                            scope="col"
                            className="cursor-pointer text-decoration-none">
                            Total Amount{' '}
                          </th>
                          <th
                            scope="col"
                            className="cursor-pointer text-decoration-none">
                            Payment Date{' '}
                          </th>
                          <th
                            scope="col"
                            className="cursor-pointer text-decoration-none">
                            Payment Status{' '}
                          </th>
                          <th
                            scope="col"
                            className="cursor-pointer text-decoration-none">
                            Refund Status{' '}
                          </th>
                          {user && (user.role === 'admin' || user.role === 'superAdmin') &&
                            <>
                              <th
                                scope="col"
                                className="cursor-pointer text-decoration-none">
                                Notes
                              </th>
                              <th
                                scope='col'
                                className='cursor-pointer text-decoration-none'>
                                Actions{' '}
                              </th>
                            </>
                          }
                        </tr>
                      </thead>
                      <tbody>
                        {reservations && reservations?.length > 0 && reservations?.map((data, index) => {
                          return <tr key={index} className="hover-bg">
                            <th scope='row'>{(paginationData?.pageSize * (paginationData?.currentPage - 1)) + index + 1}</th>
                            <td >
                              <p>{_.get(data, 'renter.firstName', '')?.length > 0 ? _.get(data, 'renter.firstName', '') + " " + _.get(data, 'renter.lastName', '') : "NA"}</p>
                            </td>
                            <td>
                              <p>{_.get(data, 'partner.partnerName', '')?.length > 0 ? _.get(data, 'partner.partnerName', '') : "NA"}</p>
                            </td>
                            <td>
                              <p>{_.get(data, 'vehicle.licensePlates', '')?.length > 0 ? _.get(data, 'vehicle.licensePlates', '') : "NA"}</p>
                            </td>
                            <td>
                              <p>{_.get(data, 'partner.timeZone', '')?.length > 0 ? _.get(data, 'partner.timeZone', '') : "NA"}</p>
                            </td>
                            <td>
                              <p>{_.get(data, 'bookingDate', '')?.length > 0 ? moment(_.get(data, 'bookingDate', '')).tz(data?.partner?.timeZone).format('MM/DD/yyyy') : "NA"}</p>
                            </td>
                            <td >
                              <p>{_.get(data, 'bookingEndDate', '')?.length > 0 ? moment(_.get(data, 'bookingEndDate', '')).tz(data?.partner?.timeZone).format('MM/DD/yyyy') : "NA"}</p>
                            </td>
                            <td>
                              {/* <p>{_.get(data, 'bookingTime', '')?.length > 0 ? moment(_.get(data, 'bookingTime', ''), ["HH:mm"]).tz(tz).format("h:mm A") : "NA"}</p> */}
                              <p>{_.get(data, 'bookingTime', '')?.length > 0 ? moment(_.get(data, 'bookingDate', '')).tz(data?.partner?.timeZone).format("h:mm A") : "NA"}</p>
                            </td>
                            <td >
                              {/* <p>{_.get(data, 'bookingTime', '')?.length > 0 ? moment(_.get(data, 'bookingEndTime', ''), ["HH:mm"]).tz(tz).format("h:mm A") : "NA"}</p> */}
                              <p>{_.get(data, 'bookingEndTime', '')?.length > 0 ? moment(_.get(data, 'bookingEndDate', '')).tz(data?.partner?.timeZone).format("h:mm A") : "NA"}</p>
                            </td>

                            {/* <td>
                              <p>{_.get(data, 'payment.charges.data[0].balance_transaction', '')?.length > 0 ? _.get(data, 'payment.charges.data[0].balance_transaction', '') : "NA"}</p>
                            </td> */}
                            {
                              (user?.role === USER_ROLE?.ADMIN || user?.role === USER_ROLE?.SUPER_ADMIN) &&
                              <>
                                <td>
                                  <p>{String(_.get(data, 'bookingAmount', ''))?.length > 0 ? `$${_.get(data, 'bookingAmount', '')}` : "NA"}</p>
                                </td>
                                <td>
                                  <p>{String(_.get(data, 'surcharge', ''))?.length > 0 ? `$${_.get(data, 'surcharge', '')}` : "NA"}</p>
                                </td>
                                <td>
                                  <p>{String(_.get(data, 'stateTax', ''))?.length > 0 ? `$${_.get(data, 'stateTax', '')}` : "NA"}</p>
                                </td>
                                <td>
                                  <p>{String(_.get(data, 'countyTax', ''))?.length > 0 ? `$${_.get(data, 'countyTax', '')}` : "NA"}</p>
                                </td>
                              </>
                            }
                            <td>
                              <p>{String(_.get(data, 'subTotal', ''))?.length > 0 ? `$${_.get(data, 'subTotal', '')}` : "NA"}</p>
                            </td>
                            <td>
                              <p>{String(_.get(data, 'payment.created', ''))?.length > 0 ? moment(toDateTime(_.get(data, 'payment.created', '')))?.tz(tz)?.format("MM/DD/yyyy") : "NA"}</p>
                            </td>
                            <td>
                              <Badge
                                shadow="lg"
                                // isLight
                                color={_.get(data, 'payment.status', '') === "succeeded" ? "success" : "danger"}
                              >
                                <p>{_.get(data, 'payment.status', '')?.length > 0 ? _.get(data, 'payment.status', '')?.charAt(0)?.toUpperCase() + _.get(data, 'payment.status', '')?.slice(1) : "Canceled"}</p>
                              </Badge>
                            </td>
                            <td>
                              <p>{_.get(data, 'notes', '')?.length > 0 ? _.get(data, 'notes', '') : "NA"}</p>
                            </td>
                            {user && (user.role === 'admin' || user.role === 'superAdmin') &&
                              <td className="chatBlock">
                                <div className='chatICon' onClick={() => {
                                  setIsNoteSectionOpen(index)
                                  setNotes(data?.textnotes)
                                }}>
                                  {
                                    data?.textnotes ?
                                      <MessageChat />
                                      :
                                      <Chat />
                                  }
                                </div>
                                {
                                  isNoteSectionOpen === index &&
                                  <div className='ChatBox'>
                                    <textarea placeholder='Please Type Here' value={textnotes} onChange={(e) => setNotes(e?.target?.value)} />
                                    <div className='Footer'>
                                      <Button
                                        style={{ marginRight: "2px" }}
                                        color='primary'
                                        isLight
                                        onClick={() => {
                                          addNotesInReservation(data?._id)
                                          setIsNoteSectionOpen(null)
                                        }} >Save</Button>
                                      <Button
                                        color='danger'
                                        isLight
                                        onClick={() => {
                                          setIsNoteSectionOpen(null)
                                        }} >Close</Button>
                                      {/* <button onClick={() => {
                                        addNotesInReservation(data?._id)
                                        setIsNoteSectionOpen(null)
                                      }}>Save</button> */}
                                    </div>
                                  </div>
                                }
                              </td>
                            }
                            {user && (user.role === 'admin' || user.role === 'superAdmin') &&
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                                  {
                                    Actions && Actions?.length > 0 && Actions.map((e) => {
                                      if (e === "Info") {
                                        return <Button key={e}
                                          style={{ width: '36px', margin: '2px' }}
                                          color='primary'
                                          isLight
                                          icon={e !== "Info" ? e : 'Eye'}
                                          onClick={() => {
                                            e === 'Info' && navigate(`detail/${_.get(data, '_id', '')}`)
                                          }} />
                                      }
                                      if (e === "Edit" && _.get(data, 'payment.status', '') === "succeeded") {
                                        return <Button key={e}
                                          style={{ width: '36px', margin: '2px' }}
                                          color='primary'
                                          isLight
                                          icon={e !== "Info" ? e : 'Eye'}
                                          onClick={() => {
                                            e === 'Edit' && navigate(`update/${_.get(data, '_id', '')}`)
                                            e === 'Delete' && openDeleteModal(data, false)
                                          }} />
                                      }
                                      if (e === "Delete") {
                                        return <Button key={e}
                                          style={{ width: '36px', margin: '2px' }}
                                          color='primary'
                                          isLight
                                          icon={e !== "Info" ? e : 'Eye'}
                                          onClick={() => {
                                            e === 'Edit' && navigate(`update/${_.get(data, '_id', '')}`)
                                            e === 'Delete' && openDeleteModal(data, false)
                                          }} />
                                      }
                                      if (e === "Avoid" &&
                                        _.get(data, 'payment.status', '') === "succeeded" &&
                                        String(_.get(data, 'isCheckoutMessageSend', '')) === "false" &&
                                        String(_.get(data, 'complete', '')) === "false"
                                        // new Date(moment(_.get(data, 'bookingDate', '')).tz(tz))?.getTime() < new Date()?.getTime()
                                      ) {
                                        return <Button key={e}
                                          style={{ width: '90px', margin: '2px' }}
                                          color='primary'
                                          isLight
                                          icon="Lock"
                                          onClick={() => openDeleteModal(data, true)} >Avoid</Button>
                                      }
                                      if (e === "Complete" &&
                                        _.get(data, 'payment.status', '') === "succeeded"
                                      ) {
                                        return <Button key={e}
                                          style={{ width: '170px', margin: '2px' }}
                                          color='danger'
                                          isLight
                                          icon="dashCircle"
                                          onClick={() => openCompleteModal(data?._id)} >End Reservation</Button>
                                      }
                                      return null
                                    })
                                  }
                                </div>
                              </td>
                            }
                          </tr>
                        }
                        )
                        }
                      </tbody>
                    </table>
                  </React.Fragment>
                </CardBody>
                <Pagination
                  id="daily"
                  hideOnSinglePage
                  onChange={(page) => onPageChanged(page, _.get(paginationData, "filter", ""))}
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
        onSubmit={() => isModalForAvoid ? avoidReservation() : deletePartner()}
        onClose={() => setIsActiveModal(false)}
        show={isActiveModal}
        title={isModalForAvoid ? "Avoid additional charge on this reservation!" : 'Delete Reservation!'}
      />
      <Modal
        onSubmit={() => onCompleteHandle()}
        onClose={() => setIsCompleteModalOpen(false)}
        show={isCompleteModalOpen}
        title="Mark complete this reseration!"
      />
    </>
  )
}

export default Reservation
