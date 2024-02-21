import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import moment from 'moment-timezone';
import _ from 'lodash';
import * as api from '../api';
import Icon from './icon/Icon';
import Input from './bootstrap/forms/Input';
import Modal, { ModalBody, ModalHeader } from './bootstrap/Modal';
import Button from '../components/bootstrap/Button';
import { useDispatch } from 'react-redux';
import { setAlert } from '../globalState/action-creators';

const Search = () => {

  const Actions = [
    "Info",
    "Edit",
  ];

  const tz = moment.tz.guess();
  const refSearchInput = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [searchModalStatus, setSearchModalStatus] = useState(false);
  const [searchData, setSearchData] = useState({
    total: 0,
    vehicle: [],
    // rate: [],
    partner: [],
    renter: [],
    reservation: []
  })

  const formik = useFormik({
    initialValues: {
      searchInput: '',
    },
    // eslint-disable-next-line no-unused-vars
    onSubmit: (values) => {
      setSearchModalStatus(true);
    },
  });

  const Search = async () => {
    try {
      const { data: { success, data, total, message } } = await api.search(formik?.values?.searchInput)
      console.log(message, "<<<data")
      if (success) {
        setSearchData(
          {
            total: total || 0,
            vehicle: _.get(data, 'vehicle', []),
            // rate: _.get(data, 'rate', []),
            partner: _.get(data, 'partner', []),
            renter: _.get(data, 'renter', []),
            reservation: _.get(data, "reservation", [])
          }
        )
      }
      else {
        dispatch(setAlert(message, "Error"))
      }
    } catch (error) {
      dispatch(setAlert(error?.message, "Error"))
      console.log(error)
    }
  }

  useEffect(() => {
    if (formik.values.searchInput) {
      setSearchModalStatus(true);
      refSearchInput?.current?.focus();
      Search()
    }
    return () => {
      setSearchModalStatus(false);
      formik.values.searchInput = ""
    };
    //eslint-disable-next-line
  }, [formik.values.searchInput]);

  return (
    <>
      <div className='d-flex' data-tour='search'>
        <label className='border-0 bg-transparent cursor-pointer' htmlFor='searchInput'>
          <Icon icon='Search' size='2x' color='primary' />
        </label>
        <Input
          id='searchInput'
          type='search'
          className='border-0 shadow-none bg-transparent'
          placeholder='Search...'
          onChange={formik.handleChange}
          value={formik.values.searchInput}
          autoComplete='off'
        />
      </div>
      <Modal
        setIsOpen={setSearchModalStatus}
        isOpen={searchModalStatus}
        isStaticBackdrop
        isScrollable
        data-tour='search-modal'>
        <ModalHeader setIsOpen={setSearchModalStatus}>
          <label className='border-0 bg-transparent cursor-pointer' htmlFor='searchInput'>
            <Icon icon='Search' size='2x' color='primary' />
          </label>
          <Input
            ref={refSearchInput}
            name='searchInput'
            className='border-0 shadow-none bg-transparent'
            placeholder='Search...'
            autoComplete="off"
            onChange={formik.handleChange}
            value={formik.values.searchInput}
          />
        </ModalHeader>
        <ModalBody>
          <table className='table table-hover table-modern caption-top mb-0'>
            <caption>Results: {searchData?.total}</caption>
            <tbody>
              {searchData && searchData?.total > 0 ?
                <>
                  {
                    searchData?.vehicle && searchData?.vehicle?.length > 0 &&
                    <strong>
                      Vehicles
                    </strong>
                  }
                  {searchData?.vehicle && searchData?.vehicle?.length > 0 && searchData?.vehicle?.map((item, index) => {
                    return <tr
                      key={index}
                      className='cursor-pointer '
                    >
                      <td className="vehicle-flex search-hover">
                        <div>
                          <Icon
                            icon="Vehicle"
                            size='lg'
                            className='me-2'
                            color='primary'
                          />
                          {item?.vehicleName + ` (${item?.licensePlates})`}
                        </div>
                        <div className="vehicle_btn">
                          {

                            Actions && Actions?.length > 0 && Actions.map((e) => {
                              return <Button key={e}
                                style={{ width: '36px', margin: '2px' }}
                                color='primary'
                                isLight
                                icon={e !== "Info" ? e : 'Eye'}
                                onClick={() => {
                                  if (e === "Info") {
                                    navigate(`/vehicles/detail/${item?._id}`);
                                    setSearchModalStatus(false);
                                    formik.values.searchInput = ""
                                  }
                                  else if (e === 'Edit') {
                                    navigate(`/vehicles/edit/${item?._id}`);
                                    setSearchModalStatus(false);
                                    formik.values.searchInput = ""
                                  }
                                }} />

                            })

                          }
                        </div>
                      </td>
                    </tr>
                  })}
                  {searchData?.partner && searchData?.partner?.length > 0 &&
                    <strong>
                      Partners
                    </strong>
                  }
                  {searchData?.partner && searchData?.partner?.length > 0 && searchData?.partner?.map((item, index) => {
                    return <tr
                      key={index}
                      className='cursor-pointer'
                    // onClick={() => {
                    //   navigate(`/partners/detail/${item?._id}`, { replace: true });
                    //   setSearchModalStatus(false);
                    //   formik.values.searchInput = ""
                    // }}
                    >
                      <td className="vehicle-flex search-hover">
                        <div>
                          <Icon
                            icon="Person"
                            size='lg'
                            className='me-2'
                            color='primary'
                          />
                          {item?.partnerName}
                        </div>
                        <div>
                          {
                            Actions && Actions?.length > 0 && Actions.map((e) => {
                              return <Button key={e}
                                style={{ width: '36px', margin: '2px' }}
                                color='primary'
                                isLight
                                icon={e !== "Info" ? e : 'Eye'}
                                onClick={() => {
                                  if (e === "Info") {
                                    navigate(`/partners/detail/${item?._id}`);
                                    setSearchModalStatus(false);
                                    formik.values.searchInput = ""
                                  }
                                  else if (e === 'Edit') {
                                    navigate(`/partners/edit/${item?._id}`);
                                    setSearchModalStatus(false);
                                    formik.values.searchInput = ""
                                  }
                                }} />
                            })
                          }
                        </div>
                      </td>
                    </tr>
                  })}
                  {/* {searchData?.rate && searchData?.rate?.length > 0 && searchData?.rate?.map((item, index) => {
                return <tr
                  key={index}
                  className='cursor-pointer'
                  onClick={() => {
                    navigate(`/single-pages/vehicles`, { replace: true });
                  }}>
                  <td>
                    <Icon
                      icon="Vehicle"
                      size='lg'
                      className='me-2'
                      color='primary'
                    />
                    {item?.name}
                  </td>
                </tr>
              })} */}
                  {searchData?.renter && searchData?.renter?.length > 0 &&
                    <strong>
                      Renters
                    </strong>
                  }
                  {searchData?.renter && searchData?.renter?.length > 0 && searchData?.renter?.map((item, index) => {
                    return <tr
                      key={index}
                      className='cursor-pointer '
                    // onClick={() => {
                    //   navigate(`/residents_information/detail/${item?._id}`, { replace: true });
                    //   setSearchModalStatus(false);
                    //   formik.values.searchInput = ""
                    // }}
                    >
                      <td className="vehicle-flex search-hover">
                        <div>
                          <Icon
                            icon="RecentActors"
                            size='lg'
                            className='me-2'
                            color='primary'
                          />
                          {item?.firstName + " " + item?.lastName}
                        </div>
                        <div>
                          {
                            Actions && Actions?.length > 0 && Actions.map((e) => {
                              return <Button key={e}
                                style={{ width: '36px', margin: '2px' }}
                                color='primary'
                                isLight
                                icon={e !== "Info" ? e : 'Eye'}
                                onClick={() => {
                                  if (e === "Info") {
                                    navigate(`/residents_information/detail/${item?._id}`);
                                    setSearchModalStatus(false);
                                    formik.values.searchInput = ""
                                  }
                                  else if (e === 'Edit') {
                                    navigate(`/residents_information/edit/${item?._id}`);
                                    setSearchModalStatus(false);
                                    formik.values.searchInput = ""
                                  }
                                }} />
                            })
                          }
                        </div>
                      </td>

                    </tr>
                  })}
                  {searchData?.reservation && searchData?.reservation?.length > 0 &&
                    <strong>
                      Reservations
                    </strong>
                  }
                  {searchData?.reservation && searchData?.reservation?.length > 0 && searchData?.reservation?.map((item, index) => {
                    console.log(searchData?.reservation)
                    return <tr
                      key={index}
                      className='cursor-pointer '
                    // onClick={() => {
                    //   navigate(`/residents_information/detail/${item?._id}`, { replace: true });
                    //   setSearchModalStatus(false);
                    //   formik.values.searchInput = ""
                    // }}
                    >
                      <td className="vehicle-flex search-hover">
                        <div>
                          <Icon
                            icon="Reservation"
                            size='lg'
                            className='me-2'
                            color='primary'
                          />
                          {item?.renter?.firstName + " " + item?.renter?.lastName} {`(
                          ${moment(item?.bookingDate).tz(tz).format("MM/DD/YYYY")}
                           - 
                          ${moment(item?.bookingEndDate).tz(tz).format("MM/DD/YYYY")}
                          )`}
                        </div>
                        <div>
                          {
                            Actions && Actions?.length > 0 && Actions.map((e) => {
                              return <Button key={e}
                                style={{ width: '36px', margin: '2px' }}
                                color='primary'
                                isLight
                                icon={e !== "Info" ? e : 'Eye'}
                                onClick={() => {
                                  if (e === "Info") {
                                    navigate(`/reservation/detail/${item?._id}`);
                                    setSearchModalStatus(false);
                                    formik.values.searchInput = ""
                                  }
                                  else if (e === 'Edit') {
                                    navigate(`/reservation/update/${item?._id}`);
                                    setSearchModalStatus(false);
                                    formik.values.searchInput = ""
                                  }
                                }} />
                            })
                          }
                        </div>
                      </td>

                    </tr>
                  })}
                </>
                :
                <tr className='table-active'>
                  <td>No result found for query "{formik.values.searchInput}"</td>
                </tr>
              }
            </tbody>
          </table>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Search;
