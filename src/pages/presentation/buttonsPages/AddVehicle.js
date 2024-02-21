import React, { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import DatePicker from 'react-date-picker';
import moment from 'moment';
import * as api from '../../../api';
import Button from '../../../components/bootstrap/Button';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Select from '../../../components/bootstrap/forms/Select';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Icon from '../../../components/icon/Icon';
import { setAlert, setLoading } from '../../../globalState/action-creators';
import './media.css';

const AddVehicle = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const token = localStorage.getItem('token');
	useEffect(() => {
		if (!token) {
			navigate('/auth-pages/login', { replace: true });
		}
		fetchPartners();
		// eslint-disable-next-line
	}, []);

	const _vehiclesColor = [
		{ value: '#000000', text: 'Black' },
		{ value: '#62b9d4', text: 'Blue' },
		{ value: '#7b6a43', text: 'Camo' },
		{ value: '#0f58e3', text: 'Cobalt' },
		{ value: '#00473b', text: 'Green' },
		{ value: '#fc9749', text: 'Orange' },
		{ value: '#d799be', text: 'Pink' },
		{ value: '#c42828', text: 'Red' },
		{ value: '#ffcbff', text: 'Rose' },
		{ value: '#f3f4f3', text: 'White' },
		{ value: '#fce832', text: 'Yellow' },
	];

	const _backseatType = [
		{ value: 'bench', text: 'Bench' },
		{ value: 'two chairs', text: 'Two Chairs' },
	];

	const _backseatColor = [
		{ value: 'black', text: 'Black' },
		{ value: 'white', text: 'white' },
	];
	const _vehicle_status = [
		{ value: 'active', text: 'Active' },
		{ value: 'inActive', text: 'Inactive' },
	];

	const [vehicleColorError, setVehicleColorError] = useState(false);
	const [yearOfMakeError, setyearOfMakeError] = useState(false);
	const [backseatColorError, setBackseatColorError] = useState(false);
	const [partnerIdError, setPartnerIdError] = useState(false);
	const [backseatTypeError, setBackseatTypeError] = useState(false);
	const [licensePlatesError, setLicensePlatesError] = useState(false);
	const [licensePlatesStateError, setLicensePlatesStateError] = useState(false);

	const [formData, setFormData] = useState({
		vehicleColor: '',
		yearOfMake: '',
		backseatColor: '',
		partnerId: '',
		backseatType: '',
		gps_imei: '',
		gps_device_install_date: '',
		battery_serial_number: '',
		battery_install_date: '',
		lockbox_serial_number: '',
		admin_passcode: '',
		lockbox_install_date: '',
		licensePlates: '',
		licensePlatesState: '',
		vin: '',
		registrationExpDate: '',
		titleImages: [],
		registrationImages: [],
		vehicleImages: [],
		qrCodeImages: [],
		status: '',
	});
	const [partnersData, setpartnersData] = useState([]);

	const onChange = (e) => {
		const { name, value } = e.target;
		if (name === 'vehicleColor') {
			setVehicleColorError(false);
		}
		if (name === 'yearOfMake') {
			setyearOfMakeError(false);
		}
		if (name === 'backseatColor') {
			setBackseatColorError(false);
		}
		if (name === 'partnerId') {
			setPartnerIdError(false);
		}
		if (name === 'backseatType') {
			setBackseatTypeError(false);
		}
		if (name === 'licensePlates') {
			setLicensePlatesError(false);
		}
		if (name === 'licensePlatesState') {
			setLicensePlatesStateError(false);
		}
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const fetchPartners = async () => {
		try {
			const { data } = await api.getPartners();
			if (data.success) {
				const optionArray = [];
				_.get(data, 'partners', []).map((partner, i) => {
					optionArray.push({ value: partner._id, text: partner.partnerName });
					return null;
				});
				setpartnersData(optionArray);
			} else {
				dispatch(setAlert(data.message, 'Error'));
			}
		} catch (error) {
			dispatch(setAlert(error.message, 'Error'));
		}
	};

	const createVehicle = async () => {
		dispatch(setLoading(true));
		try {
			let error;
			const reDigit = /^[0-9]*$/;
			let re = /^[A-Za-z0-9]*$/;

			if (_.get(formData, 'vehicleColor', '')?.length <= 0) {
				error = true;
				setVehicleColorError(true);
			}
			if (
				_.get(formData, 'yearOfMake', '')?.length <= 0 ||
				!reDigit.test(_.get(formData, 'yearOfMake', ''))
			) {
				error = true;
				setyearOfMakeError(true);
			}
			if (_.get(formData, 'backseatColor', '')?.length <= 0) {
				error = true;
				setBackseatColorError(true);
			}
			if (_.get(formData, 'partnerId', '')?.length <= 0) {
				error = true;
				setPartnerIdError(true);
			}
			if (_.get(formData, 'backseatType', '')?.length <= 0) {
				error = true;
				setBackseatTypeError(true);
			}
			if (_.get(formData, 'licensePlates', '')?.length <= 0) {
				error = true;
				setLicensePlatesError(true);
			}
			if (!error) {
				const { data } = await api.addVehicle(formData);
				if (data.success) {
					navigate('/vehicles');
					dispatch(setAlert(data.message, 'Success'));
				} else {
					dispatch(setAlert(data.message, 'Error'));
				}
			}
		} catch (error) {
			dispatch(setAlert(error.message, 'Error'));
		}
		dispatch(setLoading(false));
	};

	const [refetch, setRefetch] = useState(false);
	const [images, setImages] = useState([]);

	const onDropRejected = (files) => {
		if (files) {
			files.forEach((file) => {
				dispatch(setAlert(`Please insert a file less than 3 MB!`, 'Error'));
			});
		}
	};
	const onDrop = async (files) => {
		var _URL = window.URL || window.webkitURL;
		if (
			files?.target?.name === 'title' ||
			files?.target?.name === 'uploadRegistrationCardImage' ||
			files?.target?.name === 'qrCodeImages'
		) {
			if (files.target.files[0] !== undefined) {
				let titleImage = [];
				let RegImage = [];
				let qrCodeImages = [];
				Object.keys(files.target.files).forEach((file) => {
					if (
						(files.target.files[file].type.split('/')[0] === 'image' ||
							files.target.files[file].type.split('/')[1] === 'pdf') &&
						files.target.files[file].type.split('/')[1] !== 'gif'
					) {
						var img = new Image();
						let reader = new FileReader();
						reader.onloadend = async () => {
							img.src = _URL.createObjectURL(files.target.files[file]);
							if (files.target.files[file].type.split('/')[1] !== 'pdf') {
								img.onload = async () => {
									let name = files.target.files[file].name
										? `${files.target.files[file].name
												.replace(/-|\s/g, '-')
												.trim()}`
										: `${Math.floor(Math.random() * 100)}`;
									files?.target?.name === 'title' &&
										titleImage.push({ name, imagePreviewUrl: reader.result });
									files?.target?.name === 'uploadRegistrationCardImage' &&
										RegImage.push({ name, imagePreviewUrl: reader.result });
									files?.target?.name === 'qrCodeImages' &&
										qrCodeImages.push({ name, imagePreviewUrl: reader.result });
									files?.target?.name === 'title' &&
										setFormData({
											...formData,
											titleImages: [...titleImage],
										});
									files?.target?.name === 'uploadRegistrationCardImage' &&
										setFormData({
											...formData,
											registrationImages: [...RegImage],
										});
									files?.target?.name === 'qrCodeImages' &&
										setFormData({
											...formData,
											qrCodeImages: [...qrCodeImages],
										});
								};
							} else {
								let name = files.target.files[file].name
									? `${files.target.files[file].name
											.replace(/-|\s/g, '-')
											.trim()}`
									: `${Math.floor(Math.random() * 100)}`;
								files?.target?.name === 'title' &&
									titleImage.push({ name, imagePreviewUrl: reader.result });
								files?.target?.name === 'uploadRegistrationCardImage' &&
									RegImage.push({ name, imagePreviewUrl: reader.result });
								files?.target?.name === 'qrCodeImages' &&
									qrCodeImages.push({ name, imagePreviewUrl: reader.result });
								files?.target?.name === 'title' &&
									setFormData({
										...formData,
										titleImages: [...titleImage],
									});
								files?.target?.name === 'uploadRegistrationCardImage' &&
									setFormData({
										...formData,
										registrationImages: [...RegImage],
									});
								files?.target?.name === 'qrCodeImages' &&
									setFormData({
										...formData,
										qrCodeImages: [...qrCodeImages],
									});
							}
						};
						reader.readAsDataURL(files.target.files[file]);
					} else {
						dispatch(setAlert('Invalid File Type', 'Error'));
					}
				});
			}
		} else {
			let vehicleImages = [];
			files.forEach((file) => {
				if (file.type.split('/')[0] === 'image' && file.type.split('/')[1] !== 'gif') {
					var img = new Image();
					let reader = new FileReader();
					reader.onloadend = async () => {
						img.src = _URL.createObjectURL(file);
						img.onload = async () => {
							let name = file.name
								? file.name.replace(/-|\s/g, '-').trim()
								: Math.floor(Math.random() * 100);
							vehicleImages.push({ name, imagePreviewUrl: reader.result });
							setImages({ images: [...formData?.vehicleImages, ...vehicleImages] });
							setFormData({
								...formData,
								vehicleImages: [...formData?.vehicleImages, ...vehicleImages],
							});
						};
					};
					reader.readAsDataURL(file);
				} else {
					dispatch(setAlert('Invalid File Type', 'Error'));
				}
			});
		}
	};

	const showImage = (id) => {
		const e = document.getElementById(id);
		if (e.style.display === 'none') {
			e.style.display = 'block';
		}
	};
	const hideImage = (id) => {
		const e = document.getElementById(id);
		if (e.style.display === 'block') {
			e.style.display = 'none';
		}
	};

	return (
		<PageWrapper title='Add vehicle'>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-xxl-6'>
						<Card stretch>
							<CardHeader>
								<CardLabel icon='Plus' iconColor='dark'>
									<CardTitle tag='h4' className='h5'>
										Create Unit
									</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row'>
									<div className='create_vehicle_inner'>
										<div className='mx-2'>
											<p>
												<strong className='create-vehicle-heading'>
													Unit Features
												</strong>
											</p>
										</div>
										<div className='create-vehicle-wrapper add_vehicle'>
											<div className='card-info-item card-inner'>
												<div className='label'>
													<p className='mx-3 lable_spacing'>
														Unit Number{' '}
														<span className='text-danger fw-bold'>
															*
														</span>
													</p>
												</div>
												<div className='data'>
													<input
														type='text'
														id='yearOfMake'
														className='form-control addVehicleSelect'
														autoComplete='off'
														onChange={(e) => {
															onChange(e);
														}}
														name='unitNumber'
														style={styles.inputStyles}
													/>
												</div>
												<span
													id='yearOfMakeSpan'
													className='text-danger danger-msg'
												>
													{yearOfMakeError &&
														'Please enter a valid year!'}
												</span>
											</div>

											<div className='card-info-item card-inner'>
												<div className='label'>
													<p className='mx-3 lable_spacing'>
														Renter{' '}
														<span className='text-danger'>*</span>
													</p>
												</div>
												<div className='data'>
													<input
														type='text'
														id='licensePlates'
														className='form-control addVehicleSelect'
														autoComplete='off'
														name='renter'
														onChange={(e) => {
															onChange(e);
														}}
														style={styles.inputStyles}
													/>
												</div>
												<span
													id='licensePlatesSpan'
													className='text-danger danger-msg'
												>
													{licensePlatesError &&
														'License Plate Number required!'}
												</span>
											</div>

											<div className='card-info-item card-inner'>
												<div className='label'>
													<p className='mx-3 lable_spacing'>Start Date</p>
												</div>
												<div className='data'>
													<DatePicker
														className='form-control addVehicleSelect input_feild'
														clearIcon={null}
														name='gps_device_install_date'
														onChange={(e) =>
															setFormData({
																...formData,
																gps_device_install_date:
																	moment(e).format('MM/DD/yyyy'),
															})
														}
														format='MM/dd/yyyy'
														value={
															formData?.gps_device_install_date &&
															formData?.gps_device_install_date
																?.length > 0
																? new Date(
																		formData?.gps_device_install_date,
																  )
																: ''
														}
													/>
												</div>
												<span
													id='gps_device_install_date_Span'
													style={{
														position: 'absolute',
														opacity: '0',
														color: 'crimson',
													}}
												></span>
											</div>

											<div className='card-info-item card-inner'>
												<div className='label'>
													<p className='mx-3 lable_spacing'>
														Allowed Vehicles
													</p>
												</div>
												<div className='data'>
													<input
														type='text'
														className='form-control addVehicleSelect'
														autoComplete='off'
														name='streetParkingSpace'
														onChange={(e) => {
															onChange(e);
														}}
														style={styles.inputStyles}
													/>
												</div>
												<span
													id='licensePlatesStateSpan'
													className='text-danger danger-msg'
												>
													{licensePlatesStateError &&
														'Please enter a license plates state!'}
												</span>
											</div>
											<div className='card-info-item card-inner'>
												<div className='label'>
													<p className='mx-3 lable_spacing'>
														Driveway Space
													</p>
												</div>
												<div className='data'>
													<input
														type='text'
														className='form-control addVehicleSelect'
														autoComplete='off'
														name='drivewaySpace'
														onChange={(e) => {
															onChange(e);
														}}
														style={styles.inputStyles}
													/>
												</div>
												<span
													id='licensePlatesStateSpan'
													className='text-danger danger-msg'
												>
													{licensePlatesStateError &&
														'Please enter a license plates state!'}
												</span>
											</div>

											<div className='card-info-item card-inner'>
												<div className='label'>
													<p className='mx-3 lable_spacing'>
														Street Parking Space
													</p>
												</div>
												<div className='data'>
													<input
														type='text'
														className='form-control addVehicleSelect'
														autoComplete='off'
														name='streetParkingSpace'
														onChange={(e) => {
															onChange(e);
														}}
														style={styles.inputStyles}
													/>
												</div>
												<span
													id='licensePlatesStateSpan'
													className='text-danger danger-msg'
												>
													{licensePlatesStateError &&
														'Please enter a license plates state!'}
												</span>
											</div>

											<div className='card-info-item card-inner '>
												<div className='label'>
													<p className='mx-3 lable_spacing'>Zones</p>
												</div>
												<div className='data'>
													<input
														type='text'
														className='form-control addVehicleSelect'
														autoComplete='off'
														name='zones'
														onChange={(e) => {
															onChange(e);
														}}
														style={styles.inputStyles}
													/>
												</div>
												<span
													id='vinSpan'
													style={{
														position: 'absolute',
														opacity: '0',
														color: 'crimson',
													}}
												></span>
											</div>
										</div>
									</div>
								</div>
								<Button className='mx-2 mt-3' color='dark' onClick={createVehicle}>
									Save
								</Button>
								<Button
									className='mt-3'
									color='danger'
									onClick={() => navigate('/vehicles')}
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

const styles = {
	dateInput: {
		boxShadow: 'rgb(116 116 116 / 53%) 0px 0px 1px 1px inset',
		lineHeight: '1.5',
		padding: '0.5rem 3rem 0.5rem 1rem',
		height: '3.5rem',
		color: 'transparent',
	},
	onChangeColor: '#323232',
	inputStyles: {
		boxShadow: 'rgb(116 116 116 / 53%) 0px 0px 1px 1px inset',
		lineHeight: '1.5',
		padding: '0.5rem 3rem 0.5rem 1rem',
		height: '3.5rem',
	},
};

export default AddVehicle;
