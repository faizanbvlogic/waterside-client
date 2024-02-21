import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import exportFromJSON from 'export-from-json'
import _ from 'lodash';
import moment from 'moment-timezone'
import DatePicker from 'react-date-picker'
import * as api from '../../../api';
import { Pagination } from 'antd';
import { USER_ROLE } from "../../../constants"
import { setAlert, setLoading, setPartnerPreviewPage, setVehiclePreviewPage } from '../../../globalState/action-creators';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page'
import Button, { ButtonGroup } from '../../../components/bootstrap/Button';
import Badge from '../../../components/bootstrap/Badge';
import Select from '../../../components/bootstrap/forms/Select';
import Card, {
  CardActions,
  CardBody,
  CardHeader,
  CardLabel,
  CardTitle,
} from '../../../components/bootstrap/Card';
import RefundModal from '../../../utils/RefundModal'


const Reservation = () => {
  const Actions = [
    "Info",
    "Refund"
  ];

  const tz = moment.tz.guess();
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
    console.log("work3423432432432423")
    fetchReservations()
    fetchPartners()

    //eslint-disable-next-line
  }, [])

  const [filters, setFilters] = useState([])
  const [isAllActive, setIsAllActive] = useState(false)
  const [isHourlyActive, setIsHourlyActive] = useState(false)
  const [isDailyActive, setIsDailyActive] = useState(false)
  const [isWeeklyActive, setIsWeeklyActive] = useState(false)
  console.log(filters, "<<filters")

  const [reservations, setReservations] = useState([]);
  const [report, setReport] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalSurcharge, setTotalSurcharge] = useState(0)
  const [totalTax, setTotalTax] = useState(0)

  //REFUND MODAL
  const [isRefundModalActive, setIsRefundModalActive] = useState(false)
  const [reservationId, setReservationId] = useState('')
  const [refundAmount, setRefundAmount] = useState('')
  const [refundBy, setRefundBy] = useState('')
  const [isReason, setReason] = useState("")
  const [modalError, setModalError] = useState(false)
  const [isAdditionalChargeRefund, setIsACR] = useState(false)


  // FOR DATE FILTER
  const [dateFilter, setDateFilter] = useState(false)
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()

  // FOR PAGINATION 
  const [paginationData, setPaginationData] = useState({ total: 0, currentPage: 1, pageSize: 10, filter: "all" })
  const [fileFilter, setFileFilter] = useState("all")

  const [partners, setPartners] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [vehicleId, setVehicleId] = useState("")
  const [partnerId, setPartnerId] = useState("")

  const [partnerName, setPartnerName] = useState("")
  const [vehicleName, setVehicleName] = useState("")

  // for export excel file
  let data = []
  let fileName = `${partnerName ? partnerName + "-" : ""}${vehicleName ? vehicleName + "-" : ""}${paginationData?.filter}`
  const exportType = 'xls'

  const ExportToExcel = async () => {
    dispatch(setLoading(true))
    const startDate_ = startDate && new Date(moment(startDate).add('days', 1).format()).toISOString()
    const endDate_ = endDate && new Date(moment(endDate).add('days', 1).format()).toISOString()
    try {
      const { data: { report } } = user?.role === USER_ROLE?.PARTNER ?
        await api.getAllSucceededPartnersReservations(`page=${1}&size=${10}${((startDate || endDate) ? true : false) ? `&isDateFilter=${((startDate || endDate) ? true : false)}` : ""}${startDate_ && endDate_ && startDate_?.length > 0 && endDate_?.length > 0 ? `&startDate=${startDate_}&endDate=${endDate_}` : ""}`, { filters,  vehicleId, partnerId : user?.id})
        : await api.getAllSucceededReservations(`page=${1}&size=${10}${((startDate || endDate) ? true : false) ? `&isDateFilter=${((startDate || endDate) ? true : false)}` : ""}${startDate_ && endDate_ && startDate_?.length > 0 && endDate_?.length > 0 ? `&startDate=${startDate_}&endDate=${endDate_}` : ""}`, { filters, vehicleId, partnerId });

      fileName = `${partnerName ? partnerName + "-" : ""}${vehicleName ? vehicleName + "-" : ""}${fileFilter}-(${moment()?.format("MM-DD-YYYY hh:mm:ss A")})`
      createObjForExcel(report)
      exportFromJSON({ data, fileName, exportType })
    } catch (error) {
      console.log(error)
    }
    dispatch(setLoading(false))
  }

  const createObjForExcel = (reportData) => {
    data = []

    let tRentalFee = 0
    let tSurCharge = 0
    let tState = 0
    let tCounty = 0
    let tTax = 0
    let tAmount = 0
    let tRefund = 0

    reportData && reportData?.length > 0 &&
      reportData?.map((e, i) => {
        let Obj = {
          "Renter Name": _.get(e, "renter.firstName", "-") + " " + _.get(e, "renter.lastName", ""),
          "Partner Name": _.get(e, "partner.partnerName", "-"),
          // "Vehicle Name": _.get(e, "vehicle.vehicleName", "NA") + " " + _.get(e, "vehicle.licensePlates", ""),
          "License Plate Number": _.get(e, "vehicle.licensePlates", "-"),
          // "Transaction ID": _.get(e, "payment.charges.data[0].balance_transaction", "NA"),
          "Start Date/Time": moment(_.get(e, "bookingDate", ""))?.tz(e?.partner?.timeZone)?.format("MM-DD-YYYY hh:mm A"),
          "End Date/Time": moment(_.get(e, "bookingEndDate", ""))?.tz(e?.partner?.timeZone)?.format("MM-DD-YYYY hh:mm A"),
          "Rental Fee ($)": _.get(e, 'status', '') === "Refunded" ? "-" : _.get(e, "bookingAmount", "-"),
          "Surcharge ($)": _.get(e, 'status', '') === "Refunded" ? "-" : _.get(e, "surcharge", "-"),
          // "State Tax ($)": _.get(e, 'status', '') === "Refunded" ? "-" : _.get(e, "stateTax", "-"),
          // "County Tax ($)": _.get(e, 'status', '') === "Refunded" ? "-" : _.get(e, "countyTax", "-"),
          "Tax Amount ($)": _.get(e, 'status', '') === "Refunded" ? "-" : (Number(_.get(e, "stateTax", "0")) + Number(_.get(e, "countyTax", "0"))),
          // "Dock Fees ($)": _.get(e, "dockAmount", "NA"),
          // "Stripe Fees ($)": _.get(e, "stripeFees", "NA"),
          "Total Amount ($)": _.get(e, 'status', '') === "Refunded" ? "-" : `${_.get(e, "subTotal", "-")}`,
          "Refund Amount ($)": _.get(e, 'status', '') === "Refunded" ? `${_.get(e, "Refund.rAmount", "-")}` : "-",
          // "Status": _.get(e, "status", "NA")?.toUpperCase()
          "Created At": moment(_.get(e, "createdAt", ""))?.tz(e?.partner?.timeZone)?.format("MM-DD-YYYY"),
        };
        tRentalFee = tRentalFee + Number(_.get(e, 'status', '') === "Refunded" ? "0" : _.get(e, "bookingAmount", "0"))
        tState = tState + Number(_.get(e, 'status', '') === "Refunded" ? "0" : _.get(e, "stateTax", "0"))
        tSurCharge = tSurCharge + Number(_.get(e, 'status', '') === "Refunded" ? "0" : _.get(e, "surcharge", "0"))
        tCounty = tCounty + Number(_.get(e, 'status', '') === "Refunded" ? "0" : _.get(e, "countyTax", "0"))
        tTax = tTax + Number(Number(_.get(e, 'status', '') === "Refunded" ? "0" : _.get(e, "stateTax", "0")) + Number(_.get(e, 'status', '') === "Refunded" ? "0" : _.get(e, "countyTax", "0")))
        tAmount = tAmount + Number(_.get(e, 'status', '') === "Refunded" ? "0" : `${_.get(e, "subTotal", "0")}`)
        tRefund = tRefund + Number(_.get(e, 'status', '') === "Refunded" ? `${_.get(e, "Refund.rAmount", "0")}` : "0")
        data.push(Obj)
        if (i === (reportData?.length - 1)) {
          let total = {
            "Renter Name": "",
            "Partner Name": "",
            "License Plate Number": "",
            "Start Date/Time": "TOTAL",
            "End Date/Time": "",
            "Rental Fee ($)": tRentalFee,
            "Surcharge ($)": tSurCharge,
            // "State Tax ($)": tState,
            // "County Tax ($)": tCounty,
            "Tax Amount ($)": tTax,
            "Total Amount ($)": tAmount,
            "Refund Amount ($)": tRefund,
          };
          data.push(total)
        }
        return null;
      })
  }

  const fetchPartners = async () => {
    dispatch(setLoading(true));
    user?.role === USER_ROLE?.PARTNER && fetchVehicles(user?.id)
    if (user?.role === USER_ROLE?.ADMIN || user?.role === USER_ROLE?.SUPER_ADMIN) {
      try {
        const [partnersData] = await Promise.all([
          api.getPartners()
        ])
        if (partnersData?.data?.success) {
          const fetchedPartners = _.get(partnersData?.data, "partners", partners)?.length > 0 && _.get(partnersData?.data, "partners", partners).map((partner, index) => {
            return { value: partner?._id, text: partner?.partnerName }
          })
          setPartners([
            { value: "", text: "All" },
            ...fetchedPartners
          ]
          );
        }
        else {
          if (!partnersData?.data?.success) {
            dispatch(setAlert(partnersData?.data?.message, "Error"))
          }
        }
      } catch (error) {
        dispatch(setAlert(error?.message, "Error"))
      }
    }
    dispatch(setLoading(false));
  }


  // VEHICLES
  const fetchVehicles = async partnerId => {
    dispatch(setLoading(true));
    try {
      if (!partnerId || String(partnerId) === "false") {
        setVehicles([])
        // fetchReservations(1, paginationData?.filter, 10, "", startDate, endDate, dateFilter)
      }
      else {
        const { data } = await api.getVehiclesByPartner({ partnerId })
        if (data?.success) {
          setVehicles(
            _.get(data, "vehicles", vehicles)?.length > 0 && _.get(data, "vehicles", vehicles)?.map((vehicle) => {
              if (vehicle?.isAvailable === "available") {
                return { value: vehicle?._id, text: `${vehicle?.vehicleName} ${vehicle?.licensePlates}` }
              }
              else {
                return null;
              }
            })
          );
        }
        else {
          dispatch(setAlert(data?.message, "Error"))
        }
      }
    } catch (error) {
      dispatch(setAlert(error?.message, "Error"))
    }
    dispatch(setLoading(false));
  }


  const fetchReservations = async (isPage, isFilter, isSize, vehicleId, startDate, endDate, isDateFilter, pID, isReport) => {
    dispatch(setLoading(true))
    const page = isPage || new URLSearchParams(search).get('page') || _.get(paginationData, 'currentPage', '1');
    const size = isSize || new URLSearchParams(search).get('size') || _.get(paginationData, 'pageSize', '10');
    const filter = isFilter || new URLSearchParams(search).get('filter') || _.get(paginationData, 'filter', 'all');
    console.log({ startDate, endDate })
    const startDate_ = startDate && new Date(moment(startDate).add('days', 1).format()).toISOString()
    const endDate_ = endDate && new Date(moment(endDate).add('days', 1).format()).toISOString()

    try {
      const { data } = (user?.role === USER_ROLE?.PARTNER &&
        await api.getAllSucceededPartnersReservations(`page=${page}&size=${size}${isDateFilter ? `&isDateFilter=${isDateFilter}` : ""}${startDate_ && endDate_ && startDate_?.length > 0 && endDate_?.length > 0 ? `&startDate=${startDate_}&endDate=${endDate_}` : ""}`, { filters, vehicleId, partnerId: user?.id, })) ||
        ((user?.role === USER_ROLE?.SUPER_ADMIN || user?.role === USER_ROLE?.ADMIN) &&
          await api.getAllSucceededReservations(`page=${page}&size=${size}${isDateFilter ? `&isDateFilter=${isDateFilter}` : ""}${startDate_ && endDate_ && startDate_?.length > 0 && endDate_?.length > 0 ? `&startDate=${startDate_}&endDate=${endDate_}` : ""}`, { filters, vehicleId, partnerId: pID, isReport }))
      if (data?.success) {
        setReservations(_.get(data, "reservations", [...reservations]));
        setReport(_.get(data, "report", []));
        let __tRentalFee = 0
        let __tState = 0
        let __tSurcharge = 0
        let __tCounty = 0
        let __tTax = 0
        let __tRefund = 0
        let __tAmount = 0
        _.get(data, "report", [])?.map((e) => {
          __tRentalFee = __tRentalFee + Number(_.get(e, 'status', '') === "Refunded" ? "0" : _.get(e, "bookingAmount", "0"))
          __tState = __tState + Number(_.get(e, 'status', '') === "Refunded" ? "0" : _.get(e, "stateTax", "0"))
          __tSurcharge = __tSurcharge + Number(_.get(e, 'status', '') === "Refunded" ? "0" : _.get(e, "surcharge", "0"))
          __tCounty = __tCounty + Number(_.get(e, 'status', '') === "Refunded" ? "0" : _.get(e, "countyTax", "0"))
          __tTax = __tTax + Number(Number(_.get(e, 'status', '') === "Refunded" ? "0" : _.get(e, "stateTax", "0")) + Number(_.get(e, 'status', '') === "Refunded" ? "0" : _.get(e, "countyTax", "0")))
          __tRefund = __tRefund + Number(_.get(e, 'status', '') === "Refunded" ? `${_.get(e, "Refund.rAmount", "0")}` : "0")
          __tAmount = __tAmount + Number(_.get(e, 'status', '') === "Refunded" ? "0" : `${_.get(e, "subTotal", "0")}`)
        })
        setTotalAmount(__tAmount?.toFixed(2))
        setTotalSurcharge(__tSurcharge?.toFixed(2))
        setTotalTax(__tTax?.toFixed(2))
        setTotalRevenue((__tRentalFee)?.toFixed(2))

        setPaginationData({ ...paginationData, total: data?.total || paginationData?.total, currentPage: page, pageSize: size, filter: filter })
        dispatch(setLoading(false))
      }
      else {
        setReservations([]);
        setPaginationData({ ...paginationData, total: data?.total || paginationData?.total })
        setTotalAmount(0)
        setTotalSurcharge(0)
        setTotalTax(0)
        setTotalRevenue(0)
        // dispatch(setAlert(data?.message, "Error"))
        dispatch(setLoading(false))
      }
    } catch (error) {
      dispatch(setAlert(error?.message, "Error"))
      dispatch(setLoading(false))
    }
  }

  const onPageChanged = (page, isFilter) => {
    if (String(partnerId) === "false" || !partnerId) {
      fetchReservations(page, isFilter, 10, "", startDate, endDate, dateFilter)
    }
    else {
      fetchReservations(page, isFilter, 10, vehicleId, startDate, endDate, dateFilter, partnerId)
    }
  }

  const handleOnChange = (value, name) => {
    if (name === "startDate" && endDate) {
      fetchReservations(1, paginationData?.filter, 10, vehicleId, (value).toISOString(), new Date(endDate).toISOString(), true, partnerId)
    }
    else if (name === "endDate" && startDate) {
      if (new Date(startDate).getTime() === new Date(value).getTime()) {
        fetchReservations(1, paginationData?.filter, 10, vehicleId, new Date(startDate).toISOString(), (new Date(new Date(value).getTime() + (1000 * 60 * 60 * 24)).toISOString()), true, partnerId)
      }
      else {
        fetchReservations(1, paginationData?.filter, 10, vehicleId, new Date(startDate).toISOString(), (value).toISOString(), true, partnerId)
      }
    }
    // else if (name === "endDate" && (!startDate || startDate?.length <= 0)) {
    //   if (new Date(value).getTime() > new Date().getTime()) {
    //     fetchReservations(1, paginationData?.filter, 10, vehicleId, (new Date()).toISOString(), (value).toISOString(), true, partnerId)
    //   }
    //   else {
    //     fetchReservations(1, paginationData?.filter, 10, vehicleId, (value).toISOString(), (value).toISOString(), true, partnerId)
    //   }
    // }
    // else if (name === "startDate" && (!endDate || endDate?.length <= 0)) {
    //   fetchReservations(1, paginationData?.filter, 10, vehicleId, (value).toISOString(), (new Date(new Date(value).getTime() + (1000 * 60 * 60 * 24)).toISOString()), true, partnerId)
    // }
    else {
      console.log("else work")
    }
  };

  const onVehicleChange = (e) => {
    const { name, value } = e?.target;
    fetchReservations(1, paginationData?.filter, 10, value, startDate, endDate, !!(startDate && endDate))
  }

  const openRefundModal = (id, amount, isAdditionalChargeRefund) => {
    setReservationId(id)
    setRefundAmount(amount)
    setIsACR(isAdditionalChargeRefund)
    setIsRefundModalActive(true)
  }

  // REFUND BOOKING AMOUNT
  async function refund() {
    dispatch(setLoading(true))
    try {
      let err;
      if (!isReason || isReason?.length < 3 || !refundBy || refundBy?.length < 3) {
        err = true
        setModalError(true)
      }
      if (!err) {
        const { data } = await api.refund(reservationId, refundAmount, isAdditionalChargeRefund, { isReason, refundBy })
        if (data?.success) {
          // fetchReservations(1, "all")
          setIsRefundModalActive(false)
          dispatch(setAlert(data?.message, "Success"))
          fetchReservations()
          setReason("")
          setRefundBy("")
        }
        else {
          setIsRefundModalActive(false)
          dispatch(setAlert(data?.message, "Error"))
        }
      }
    } catch (error) {
      setIsRefundModalActive(false)
      dispatch(setAlert(error?.message, "Error"))
    }
    dispatch(setLoading(false))
  }

  // set filters like "hourly", "daily", "weekly"
  const handleFilters = (filterName) => {
    const index = filters.indexOf(filterName)
    if (filterName === "all") {
      setFilters(["hourly", "EXTENDED", "Additional_Charge", "daily", "weekly"])
    }
    else if (index === -1) {
      if (filterName === "hourly") {
        setFilters([...filters, "hourly", "EXTENDED", "Additional_Charge"])
      }
      else {
        setFilters([...filters, filterName])
      }
    }
    else {
      if (isAllActive) {
        setIsAllActive(false)
        setFilters(filterName === "hourly" ? ["hourly", "EXTENDED", "Additional_Charge"] : [filterName])
      }
      else if (filterName === "hourly") {
        console.log("work inside")
        let filtersClone = filters;
        filtersClone.splice(index, 3)
        setFilters(filtersClone)
      }
      else {
        let filtersClone = filters;
        filtersClone.splice(index, 1)
        setFilters(filtersClone)
      }
    }
  }

  return (
    <>
      <PageWrapper title={"Reservations"}>
        <Page container='fluid'>
          {user?.role === USER_ROLE?.SUPER_ADMIN &&
            <div className="row">
              <div className="col-md-3">
                <Card stretch>
                  <CardHeader>
                    <CardLabel iconColor="dark">
                      <CardTitle tag="h4" className="h5">
                        Total Amount
                      </CardTitle>
                    </CardLabel>
                  </CardHeader>
                  <CardBody>
                    <CardLabel >
                      <CardTitle tag="h4" className="h5" style={{ fontSize: "25px" }}>
                        ${totalAmount}
                      </CardTitle>
                    </CardLabel>
                  </CardBody>
                </Card>
              </div>
              <div className="col-md-3">
                <Card stretch>
                  <CardHeader>
                    <CardLabel iconColor="dark">
                      <CardTitle tag="h4" className="h5">
                        Total Revenue
                      </CardTitle>
                    </CardLabel>
                  </CardHeader>
                  <CardBody>
                    <CardLabel >
                      <CardTitle tag="h4" className="h5" style={{ fontSize: "25px" }}>
                        ${totalRevenue}
                      </CardTitle>
                    </CardLabel>
                  </CardBody>
                </Card>
              </div>
              <div className="col-md-3">
                <Card stretch>
                  <CardHeader>
                    <CardLabel iconColor="dark">
                      <CardTitle tag="h4" className="h5">
                        Total Surcharge
                      </CardTitle>
                    </CardLabel>
                  </CardHeader>
                  <CardBody>
                    <CardLabel >
                      <CardTitle tag="h4" className="h5" style={{ fontSize: "25px" }}>
                        ${totalSurcharge}
                      </CardTitle>
                    </CardLabel>
                  </CardBody>
                </Card>
              </div>
              <div className="col-md-3">
                <Card stretch>
                  <CardHeader>
                    <CardLabel iconColor="dark">
                      <CardTitle tag="h4" className="h5">
                        Total Tax
                      </CardTitle>
                    </CardLabel>
                  </CardHeader>
                  <CardBody>
                    <CardLabel >
                      <CardTitle tag="h4" className="h5" style={{ fontSize: "25px" }}>
                        ${totalTax}
                      </CardTitle>
                    </CardLabel>
                  </CardBody>
                </Card>
              </div>

            </div>
          }
          <div className='row'>
            <div className='col-xxl-6'>
              <Card stretch>
                <CardHeader className="revenueHeader">
                  <CardLabel icon='CurrencyDollar' iconColor='primary'>
                    <CardTitle tag='h4' className='h5'>
                      Revenue
                    </CardTitle>
                  </CardLabel>
                  <CardActions className="revenue-header-btn">
                    <ButtonGroup
                      className={"btn-group"}
                      // isToolbar={true}
                      isVertical={false}
                      size={'sm'}
                      ariaLabel={String}
                    >
                      <Button color='dark' isLight
                        isActive={(isAllActive || filters?.length <= 0) ? true : false}
                        className="revenue-btn-remove"
                        onClick={() => {
                          setIsAllActive(!isAllActive)
                          setIsHourlyActive(false)
                          setIsDailyActive(false)
                          setIsWeeklyActive(false)
                          handleFilters("all")
                          setPaginationData({
                            ...paginationData,
                            filter: "all"
                          })
                          setFileFilter("all")
                          setStartDate("")
                          setEndDate("")
                          setDateFilter(false)
                        }}
                      >All</Button>
                      <Button color='dark' isLight
                        isActive={isHourlyActive}
                        className="revenue-btn-remove"
                        onClick={() => {
                          setIsAllActive(false)
                          setIsHourlyActive(!isHourlyActive)
                          handleFilters("hourly")
                          setPaginationData({
                            ...paginationData,
                            filter: "hourly"
                          })
                          setFileFilter("hourly")
                          setStartDate("")
                          setEndDate("")
                          setDateFilter(false)
                          // fetchReservations(1, "hourly", 10, vehicleId)
                        }}
                      >Hourly</Button>
                      <Button color='dark' isLight
                        isActive={isDailyActive}
                        className="revenue-btn-remove"
                        onClick={() => {
                          setIsAllActive(false)
                          setIsDailyActive(!isDailyActive)
                          handleFilters("daily")
                          setPaginationData({
                            ...paginationData,
                            filter: "daily"
                          })
                          setFileFilter("daily")
                          setStartDate("")
                          setEndDate("")
                          setDateFilter(false)
                          // fetchReservations(1, "daily", 10, vehicleId)
                        }}
                      >Daily</Button>
                      <Button color='dark' isLight
                        isActive={isWeeklyActive}
                        className="revenue-btn-remove"
                        onClick={() => {
                          setIsAllActive(false)
                          setIsWeeklyActive(!isWeeklyActive)
                          handleFilters("weekly")
                          setPaginationData({
                            ...paginationData,
                            filter: "weekly"
                          })
                          setFileFilter("weekly")
                          setStartDate("")
                          setEndDate("")
                          setDateFilter(false)
                          // fetchReservations(1, "weekly", 10, vehicleId)
                        }}
                      >Weekly</Button>
                      <Button color='dark' isLight
                        className="revenue-btn-remove"
                        onClick={() => alert("Under development")}
                      >Monthly</Button>
                    </ButtonGroup>
                    <Button
                      className="export-revenue-btn"
                      color='dark'
                      isLight
                      icon="Download"
                      onClick={() => ExportToExcel()}
                    ><div className='export_text'>Report</div></Button>
                  </CardActions>
                </CardHeader>
                <CardActions className="revenue_header">
                  {
                    (user?.role === USER_ROLE?.ADMIN || user?.role === USER_ROLE?.SUPER_ADMIN) &&
                    <div className='card-info-item card-inner card-height picker-box'>
                      <p className="editrate-text lable_spacing">Partner</p>
                      <Select
                        ariaLabel='Default select example'
                        placeholder='All'
                        style={{ boxShadow: 'rgb(116 116 116 / 53%) 0px 0px 1px 1px inset' }}
                        id="partnerId"
                        name="partnerId"
                        list={partners?.length > 0 ? partners : [{ value: "", text: "All" }]}
                        onChange={(e) => {
                          setPartnerName(partners[document.getElementById("partnerId")?.selectedIndex - 1]?.text)
                          setPartnerId(e?.target?.value)
                          // fetchReservations(1, filters, 10, "", startDate, endDate, !!(startDate && endDate), e?.target?.value)
                          fetchVehicles(e?.target?.value)
                          setVehicleId("")
                        }}
                        className="addVehicleSelect inputBoxShadow"
                      />
                    </div>
                  }
                  <div className='card-info-item card-inner card-height picker-box'>
                    <p className="editrate-text lable_spacing">Vehicles</p>
                    <Select
                      ariaLabel='Default select example'
                      placeholder='All'
                      style={{ boxShadow: 'rgb(116 116 116 / 53%) 0px 0px 1px 1px inset' }}
                      id="vehicleId"
                      name="vehicleId"
                      list={vehicles?.length > 0 ? vehicles : [{ value: "", text: "All" }]}
                      onChange={(e) => {
                        setVehicleName(vehicles[document.getElementById("vehicleId")?.selectedIndex - 1]?.text)
                        setVehicleId(e?.target?.value)
                        setStartDate("")
                        setEndDate("")
                        // onVehicleChange(e)
                      }}
                      className="addVehicleSelect inputBoxShadow"
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
                        setStartDate(moment(new Date(e)?.toISOString())?.tz(tz)?.toISOString())
                        // handleOnChange(moment(new Date(e)?.toISOString())?.subtract(1, "days")?.tz(tz), "startDate")
                      }}
                      format="MM/dd/yyyy"
                      value={startDate ? new Date(startDate) : ""}
                    />
                  </div>
                  <div className='card-info-item card-inner card-height picker-box'>
                    <p className="editrate-text lable_spacing">End Date</p>
                    <DatePicker
                      className='form-control addVehicleSelect input_feild picker-reservation'
                      clearIcon={null}
                      name="endDate"
                      disabled={!!!startDate}
                      minDate={startDate ? new Date(startDate) : ""}
                      onChange={(e) => {
                        let dt = new Date(moment(new Date(e)?.toISOString())?.tz(tz)?.format("MM/DD/YYYY") + " " + "00:00")
                        console.log({ dt })
                        setEndDate(dt?.toISOString())
                        // handleOnChange(dt, "endDate")
                      }}
                      format="MM/dd/yyyy"
                      value={endDate ? new Date(endDate) : ""}
                    />
                  </div>
                  <Button color='dark'
                    isLight
                    icon="search"
                    className="export-revenue-btn "
                    onClick={() => {
                      console.log({ filters, partnerName, vehicleId, startDate, endDate })
                      fetchReservations(1, filters, 10, vehicleId, startDate, endDate, ((startDate || endDate) ? true : false), partnerId)
                    }}
                  >Search</Button>
                  <div className='revenue-btn-block'>
                    {
                      (user?.role === USER_ROLE?.ADMIN || user?.role === USER_ROLE?.SUPER_ADMIN) && <Button
                        className="export-revenue-btn"
                        color='dark'
                        isLight
                        icon="cancel"
                        onClick={() => {
                          setPaginationData({
                            ...paginationData,
                            filter: "all"
                          })
                          handleFilters("all")
                          setVehicleName("")
                          setFilters([])
                          setVehicles([])
                          setPartners([])
                          setPartnerName("all")
                          setPartnerId("")
                          setVehicleId("")
                          setFileFilter("all")
                          setStartDate("")
                          setEndDate("")
                          setIsHourlyActive(false)
                          setIsDailyActive(false)
                          setIsWeeklyActive(false)
                          setDateFilter(false)
                          fetchReservations(1, [], 10)?.then()?.then(() =>
                            fetchPartners()
                          )
                        }}
                      >
                        <div className='export_text'>Clear Filter</div>
                      </Button>
                    }

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
                            Vehicle Name{' '}
                          </th>
                          <th
                            scope="col"
                            className="cursor-pointer text-decoration-none">
                            Transaction ID{' '}
                          </th>
                          <th
                            scope="col"
                            className="cursor-pointer text-decoration-none">
                            Status{' '}
                          </th>
                          <th
                            scope="col"
                            className="cursor-pointer text-decoration-none">
                            Booking Type{' '}
                          </th>
                          {
                            (user?.role === USER_ROLE?.SUPER_ADMIN || user?.role === USER_ROLE?.ADMIN) &&
                            <React.Fragment>
                              <th
                                scope="col"
                                className="cursor-pointer text-decoration-none">
                                Booking Amount{' '}
                              </th>
                              <th
                                scope="col"
                                className="cursor-pointer text-decoration-none">
                                Surcharge Amount{' '}
                              </th>
                              <th
                                scope="col"
                                className="cursor-pointer text-decoration-none no_wrap">
                                State Tax{' '}
                              </th>
                              <th
                                scope="col"
                                className="cursor-pointer text-decoration-none no_wrap">
                                County Tax{' '}
                              </th>
                              {/* <th
                                scope="col"
                                className="cursor-pointer text-decoration-none no_wrap">
                                Dock Fees{' '}
                              </th>
                              <th
                                scope="col"
                                className="cursor-pointer text-decoration-none no_wrap">
                                Stripe Fees{' '}
                              </th> */}
                            </React.Fragment>
                          }
                          <th
                            scope="col"
                            className="cursor-pointer text-decoration-none">
                            Total Amount{' '}
                          </th>
                          <th
                            scope="col"
                            className="cursor-pointer text-decoration-none">
                            Refund Amount{' '}
                          </th>
                          <th
                            scope="col"
                            className="cursor-pointer text-decoration-none">
                            Created At{' '}
                          </th>


                          {user && (user.role === 'admin' || user.role === 'superAdmin') &&
                            <th
                              scope='col'
                              className='cursor-pointer text-decoration-none'>
                              Actions{' '}
                            </th>
                          }
                        </tr>
                      </thead>
                      <tbody>
                        {reservations && reservations?.length > 0 && reservations?.map((data, index) => {
                          return <tr key={index} className="hover-bg"
                          //  style={{ backgroundColor: _.get(data, 'status', '') === "Refunded" && "rgb(255 242 0 / 30%)" }}
                          >
                            <th scope='row'>{(paginationData?.pageSize * (paginationData?.currentPage - 1)) + index + 1}</th>
                            <td >
                              <p>{_.get(data, 'renter.firstName', '')?.length > 0 ? _.get(data, 'renter.firstName', '') + " " + _.get(data, 'renter.lastName', '') : "-"}</p>
                            </td>
                            <td>
                              <p>{_.get(data, 'partner.partnerName', '')?.length > 0 ? _.get(data, 'partner.partnerName', '') : "-"}</p>
                            </td>
                            <td>
                              <p>{_.get(data, 'vehicle.licensePlates', '')?.length > 0 ? _.get(data, 'vehicle.licensePlates', '') : "-"}</p>
                            </td>
                            <td>
                              <p>{_.get(data, 'payment.charges.data[0].balance_transaction', '')?.length > 0 ? _.get(data, 'payment.charges.data[0].balance_transaction', '') : "-"}</p>
                            </td>
                            <td>
                              <Badge
                                shadow="lg"
                                // isLight
                                color={
                                  (_.get(data, 'status', '') === "deleted" && "dark") ||
                                  (_.get(data, 'status', '') === "Refunded" && "danger") ||
                                  (_.get(data, 'status', '') === "paid" && "success") ||
                                  (_.get(data, 'status', '') === "Paid" && "dark") ||
                                  "dark"
                                }
                              >
                                <p>{_.get(data, 'status', '')?.length > 0 ? _.get(data, 'status', '')?.toUpperCase() : "-"}</p>
                              </Badge>
                            </td>
                            <td>
                              <p>{_.get(data, 'bookingMethod', '')?.length > 0 ? _.get(data, 'bookingMethod', '')?.toUpperCase() === "ADDITIONAL_CHARGE" ? "Overstay_Fees" : (data?.modification?.isModified ? _.get(data, 'bookingMethod', '')?.toUpperCase() + " (MODIFIED)" : _.get(data, 'bookingMethod', '')?.toUpperCase()) : "-"}</p>
                            </td>
                            {
                              (user?.role === USER_ROLE?.SUPER_ADMIN || user?.role === USER_ROLE?.ADMIN) &&
                              <React.Fragment>
                                <td>
                                  {
                                    _.get(data, 'Refund.isNewEntry', '') === true ?
                                      <p>-</p> :
                                      <p>{_.get(data, 'bookingAmount', '')?.length > 0 ? `$${_.get(data, 'bookingAmount', '')}` : "-"}</p>
                                  }
                                </td>
                                <td>
                                  {
                                    _.get(data, 'Refund.isNewEntry', '') === true ?
                                      <p>-</p> :
                                      <p>{_.get(data, 'surcharge', '')?.length > 0 ? `$${_.get(data, 'surcharge', '')}` : "-"}</p>
                                  }
                                </td>
                                <td>
                                  {
                                    _.get(data, 'Refund.isNewEntry', '') === true ?
                                      <p>-</p> :
                                      <p>{_.get(data, 'stateTax', '')?.length > 0 ? `$${_.get(data, 'stateTax', '')}` : "-"}</p>
                                  }
                                </td>
                                <td>
                                  {
                                    _.get(data, 'Refund.isNewEntry', '') === true ?
                                      <p>-</p> :
                                      <p>{_.get(data, 'countyTax', '')?.length > 0 ? `$${_.get(data, 'countyTax', '')}` : "-"}</p>
                                  }
                                </td>
                                {/* <td>
                                  <p>{_.get(data, 'dockAmount', '')?.length > 0 ? `$${_.get(data, 'dockAmount', '')}` : "NA"}</p>
                                </td>
                                <td>
                                  <p>{_.get(data, 'stripeFees', '')?.length > 0 ? `$${_.get(data, 'stripeFees', '')}` : "NA"}</p>
                                </td> */}
                              </React.Fragment>
                            }
                            <td>
                              <p>
                                {
                                  _.get(data, 'Refund.isNewEntry', '') === true ?
                                    "-" :
                                    <strong >{String(_.get(data, 'subTotal', ''))?.length > 0 ? `$${_.get(data, 'subTotal', '')}` : "-"}</strong>
                                }
                              </p>
                            </td>
                            <td>
                              <p>
                                {
                                  _.get(data, 'Refund.isNewEntry', '') === true ?
                                    <strong >
                                      {_.get(data, 'Refund.isRefunded', '') === true && "-"}
                                      {String(_.get(data, 'Refund.rAmount', ''))?.length > 0 ? `$${_.get(data, 'Refund.rAmount', '')}` : "-"}
                                    </strong>
                                    : "-"
                                }
                              </p>
                            </td>
                            <td>
                              <p>{_.get(data, 'createdAt', '')?.length > 0 ? moment(_.get(data, 'createdAt', ''))?.tz(tz)?.format("MM-DD-YYYY") : "-"}</p>
                            </td>

                            {user && (user.role === 'admin' || user.role === 'superAdmin') &&
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                  {
                                    Actions && Actions?.length > 0 && Actions.map((e) => {
                                      if (e === "Info") {
                                        return <Button key={e}
                                          style={{ width: '36px', margin: '2px' }}
                                          color='primary'
                                          isLight
                                          icon={e !== "Info" ? e : 'Eye'}
                                          onClick={() => navigate(`detail/${data?._id}`)}
                                        />
                                      }
                                      if (e === "Refund" && data?.status !== "Refunded" && !data?.Refund?.isRefunded) {
                                        return <Button key={e}
                                          style={{ width: '100px', margin: '2px' }}
                                          color='primary'
                                          isLight
                                          icon="refresh"
                                          onClick={() => openRefundModal(data?._id, data?.subTotal, data?.bookingMethod === "Additional_Charge" ? true : false)}
                                        >Refund</Button>
                                      }
                                      return null
                                    })
                                  }
                                </div>
                              </td>
                            }
                          </tr>
                        }
                        )}
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
      <RefundModal
        onSubmit={() => refund()}
        onClose={() => {
          setIsRefundModalActive(false)
          setReason("")
          setRefundBy("")
          setModalError(false)
        }}
        show={isRefundModalActive}
        title="REFUND BOOKING AMOUNT!"
        isReason
        reasonValue={isReason}
        BYValue={refundBy}
        reason={(e) => setReason(e?.target?.value)}
        BY={(e) => setRefundBy(e?.target?.value)}
        isError={modalError}
        // isAdditionalCharge={isAdditionalChargeRefund}
        isAdditionalCharge={true}
        additionalAmount={refundAmount}
        changeAdditonalChargeAmount={(e) => setRefundAmount(e?.target?.value)}
      />
    </>
  )
}

export default Reservation
