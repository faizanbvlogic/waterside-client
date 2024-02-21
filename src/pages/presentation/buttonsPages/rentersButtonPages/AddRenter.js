import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import InputMask from 'react-text-mask';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

import * as api from '../../../../api';
import { US_STATES } from '../../../../constants';
import { REGISTRATION_TYPE } from '../../../../constants';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';
import Button from '../../../../components/bootstrap/Button';
import Select from '../../../../components/bootstrap/forms/Select';
import Page from '../../../../layout/Page/Page';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import moment from 'moment';
import DatePicker from 'react-date-picker';
import { setAlert, setLoading } from '../../../../globalState/action-creators';

const { REACT_APP_GOOGLE_ADDRESS_API_KEY } = process.env;

const AddRenter = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const token = localStorage.getItem('token');

	useEffect(() => {
		if (!token) {
			navigate('/auth-pages/login', { replace: true });
		}
		// eslint-disable-next-line
	}, []);

	const phoneNumberMask = [
		'(',
		/[1-9]/,
		/\d/,
		/\d/,
		')',
		' ',
		/\d/,
		/\d/,
		/\d/,
		'-',
		/\d/,
		/\d/,
		/\d/,
		/\d/,
	];

	const [nameError, setNameError] = useState(false);
	const [registrationTypeError, setRegistrationTypeError] = useState(false);
	const [moveInDateError, setMoveInDateError] = useState(false);
	const [moveOutDateError, setMoveOutDateError] = useState(false);
	const [contactNumberError, setContactNumberError] = useState(false);
	const [emailError, setEmailError] = useState(false);
	const [unitsError, setUnitsError] = useState(false);
	const [isAddressError, setAddressError] = useState(false);

	const [formData, setFormData] = useState({
		resdentorName: '',
		email: '',
		phoneNumber: '',
		registrationType: '',
		moveInDate: '',
		MoveOutDate: '',
		units: '',
		model: '',
		make: '',
	});

	const createRenter = async () => {
		dispatch(setLoading(true));
		try {
			const regex =
				/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

			let error = false;

			if (_.get(formData, 'resdentorName', '')?.length <= 0) {
				error = true;
				setNameError(true);
			}
			if (_.get(formData, 'registrationType', '')?.length <= 0) {
				error = true;
				setRegistrationTypeError(true);
			}
			if (_.get(formData, 'MoveInDate', '')?.length <= 0) {
				error = true;
				setMoveInDateError(true);
			}
			if (_.get(formData, 'MoveOutDate', '')?.length <= 0) {
				error = true;
				setMoveOutDateError(true);
			}

			if (_.get(formData, 'street_address', '')?.length <= 0) {
				error = true;
				setAddressError(true);
			}

			if (
				_.get(formData, 'email', '')?.length <= 0 ||
				!regex.test(_.get(formData, 'email', ''))
			) {
				error = true;
				setEmailError(true);
			}
			if (
				(_.get(formData, 'phoneNumber', '').length > 0 &&
					_.get(formData, 'phoneNumber', '')?.replace(/[^\d]/g, '').length < 10) ||
				_.get(formData, 'phoneNumber', '').length <= 0
			) {
				error = true;
				setContactNumberError(true);
			}

			formData.phoneNumber =
				_.get(formData, 'phoneNumber', '').length > 0
					? _.get(formData, 'phoneNumber', '')?.replace(/[^\d]/g, '')
					: '';

			if (!error) {
				console.log('!error');
				const { data } = await api.addRenters(formData);
				if (data?.success) {
					navigate('/residents_information');
				} else {
					dispatch(setAlert(data?.message, 'Error'));
				}
			}
		} catch (error) {
			dispatch(setAlert(error?.message, 'Error'));
		}
		dispatch(setLoading(false));
	};

	const onChange = (e) => {
		const { name, value } = e.target;
		if (name === 'firstName') {
			setNameError(false);
		}
		if (name === 'lastName') {
			setRegistrationTypeError(false);
		}

		if (name === 'phoneNumber') {
			setContactNumberError(false);
		}
		if (name === 'email') {
			setEmailError(false);
		}

		if (name === 'street_address') {
			setUnitsError(false);
		}

		setFormData({ ...formData, [name]: value });
	};

	return (
		<PageWrapper title='Add vehicle'>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-xxl-6'>
						<Card stretch>
							<CardHeader>
								<CardLabel icon='PersonAdd' iconColor='dark'>
									<CardTitle tag='h4' className='h5'>
										Create Resident
									</CardTitle>
								</CardLabel>
							</CardHeader>

							{/* ###############################################faizan works############################## */}
							<CardBody>
								<div className='row'>
									<div className='create_vehicle_inner'>
										<div className='create-vehicle-wrapper add_vehicle'>
											<div className='card-info-item card-inner'>
												<div className='label'>
													<p className='mx-3 lable_spacing'>
														Name{' '}
														<span className='text-danger fw-bold'>
															*
														</span>
													</p>
												</div>
												<div className='data'>
													<input
														type='text'
														id='renterName'
														className='form-control addVehicleSelect'
														autoComplete='off'
														onChange={(e) => {
															onChange(e);
														}}
														name='resdentorName'
													/>
												</div>
												<span className='text-danger danger-msg'>
													{/* {firstNameError ? 'First name required!' : ''} */}
												</span>
											</div>

											<div className='card-info-item card-inner'>
												<div className='label'>
													<p className='mx-3 lable_spacing'>
														Phone Number{' '}
														<span className='text-danger'>*</span>
													</p>
												</div>
												<div className='data'>
													<InputMask
														guide={false}
														type='text'
														value={_.get(formData, `phoneNumber`, '')}
														// keepCharPositions={false}
														mask={phoneNumberMask}
														className='form-control addVehicleSelect delete_form_input addpartner_withoutbtn'
														name='phoneNumber'
														onChange={(e) => onChange(e)}
													/>
												</div>
												<span className='text-danger danger-msg'>
													{contactNumberError
														? 'Enter a valid phone number!'
														: ''}
												</span>
											</div>

											<div className='card-info-item card-inner'>
												<div className='label'>
													<p className='mx-3 lable_spacing'>
														Email{' '}
														<span className='text-danger fw-bold'>
															*
														</span>
													</p>
												</div>
												<div className='data'>
													<input
														type='text'
														id='email'
														className='form-control addVehicleSelect'
														autoComplete='off'
														onChange={(e) => {
															onChange(e);
														}}
														name='email'
													/>
												</div>
												<span className='text-danger danger-msg'>
													{emailError ? 'Invalid Email!' : ''}
												</span>
											</div>

											<div className='card-info-item card-inner'>
												<div className='label'>
													<p className='mx-3 lable_spacing'>
														License Plate
													</p>
												</div>
												<div className='data'>
													<input
														type='text'
														id='city'
														className='form-control addVehicleSelect'
														autoComplete='off'
														name='licensePlate'
														onChange={(e) => {
															onChange(e);
														}}
													/>
												</div>
												{/* <span className='text-danger danger-msg'>{cityError ? "City required!" : ''}</span> */}
											</div>

											<div className='card-info-item card-inner'>
												<div className='label'>
													<p className='mx-3 lable_spacing'>Units</p>
												</div>
												<div className='data'>
													<input
														type='text'
														id='zipcode'
														className='form-control addVehicleSelect'
														name='units'
														onChange={(e) => {
															onChange(e);
														}}
													/>
												</div>
												{/* <span className='text-danger danger-msg'>{zipcodeError ? "Zipcode required!" : ''}</span> */}
											</div>

											<div className='card-info-item card-inner'>
												<div className='label'>
													<p className='mx-3 lable_spacing'>Make</p>
												</div>
												<div className='data'>
													<input
														type='text'
														className='form-control addVehicleSelect'
														autoComplete='off'
														onChange={(e) => {
															onChange(e);
														}}
														name='make'
													/>
												</div>
												{/* <span className='text-danger danger-msg'>{billingAddressError ? "Billing address required!" : ''}</span> */}
											</div>

											<div className='card-info-item card-inner'>
												<div className='label'>
													<p className='mx-3 lable_spacing'>Model</p>
												</div>
												<div className='data'>
													<input
														type='text'
														className='form-control addVehicleSelect'
														autoComplete='off'
														name='model'
														onChange={(e) => {
															onChange(e);
														}}
													/>
												</div>
												{/* <span className='text-danger danger-msg'>{driverLicenseNumberError ? "License expiration date required!" : ''}</span> */}
											</div>

											{/* move in date faizan */}
											<div className='card-info-item card-inner'>
												<div className='label'>
													<p className='mx-3 lable_spacing'>
														Move in Date{' '}
														<span className='text-danger fw-bold'>
															*
														</span>
													</p>
												</div>
												<div className='data'>
													<DatePicker
														className='form-control addVehicleSelect input_feild'
														clearIcon={null}
														name='moveInDate'
														onChange={(e) => {
															setFormData({
																...formData,
																moveInDate:
																	moment(e).format('MM/DD/yyyy'),
															});
															setMoveInDateError(false);
														}}
														format='MM/dd/yyyy'
														value={
															formData?.moveInDate &&
															formData?.moveInDate?.length > 0
																? new Date(formData?.moveInDate)
																: ''
														}
													/>
												</div>
												<span className='text-danger danger-msg'>
													{moveInDateError
														? 'Date of birth required!'
														: ''}
												</span>
											</div>

											<div className='card-info-item card-inner'>
												<div className='label'>
													<p className='mx-3 lable_spacing'>
														Move Out Date
													</p>
												</div>
												<div className='data'>
													<DatePicker
														className='form-control addVehicleSelect input_feild'
														clearIcon={null}
														name='MoveOutDate'
														onChange={(e) => {
															setFormData({
																...formData,
																MoveOutDate:
																	moment(e).format('MM/DD/yyyy'),
															});
															setMoveOutDateError(false);
														}}
														format='MM/dd/yyyy'
														value={
															formData?.MoveOutDate &&
															formData?.MoveOutDate?.length > 0
																? new Date(formData?.MoveOutDate)
																: ''
														}
													/>
												</div>
												{/* <span className='text-danger danger-msg'>{licenseExpirationDateError ? "License expiration date required!" : ''}</span> */}
											</div>

											<div className='card-info-item card-inner'>
												<div className='label'>
													<p className='mx-3 lable_spacing'>
														Registration Type
													</p>
												</div>
												<div className='data'>
													<Select
														ariaLabel='Default select example'
														placeholder=' '
														id='state'
														name='registrationType'
														value={formData?.registrationType}
														onChange={(e) => {
															onChange(e);
														}}
														list={REGISTRATION_TYPE}
														className='addVehicleSelect inputBoxShadow'
													/>
												</div>
												{/* <span className='text-danger danger-msg'>{stateError ? "State required!" : ''}</span> */}
											</div>
										</div>
									</div>
								</div>
								{
									<span className='text-danger danger-msg'>
										{(nameError ||
											registrationTypeError ||
											moveInDateError ||
											moveOutDateError ||
											contactNumberError ||
											emailError ||
											// cityError ||
											// stateError ||
											// driverLicenseError ||
											// licenseExpirationDateError ||
											// driverLicenseNumberError ||
											// rentelInfoError ||
											// billingAddressError ||
											// zipcodeError||
											unitsError) &&
											'Please fill out all required fields!'}
									</span>
								}

								<Button className='mx-2 mt-3' color='dark' onClick={createRenter}>
									Save
								</Button>
								<Button
									className='mt-3'
									color='danger'
									onClick={() => navigate('/residents_information')}
								>
									Cancel
								</Button>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default AddRenter;
