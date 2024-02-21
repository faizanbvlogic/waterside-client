import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as api from '../../../api';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import {
	setAlert,
	setPartnerPreviewPage,
	setVehiclePreviewPage,
} from '../../../globalState/action-creators';

const Dashboard = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const token = localStorage.getItem('token');
	useEffect(() => {
		if (!token) {
			navigate('/auth-pages/login', { replace: true });
		}
		dispatch(setPartnerPreviewPage({ partnerPage: 1 }));
		dispatch(setVehiclePreviewPage({ vehiclePage: 1 }));
		fetchDashboardData();

		// eslint-disable-next-line
	}, []);

	const [vehicle, setVehicle] = useState();
	const [partner, setPartner] = useState();
	const [renter, setRenter] = useState();

	const fetchDashboardData = async () => {
		try {
			const { data } = await api.dashboard();
			if (data?.success) {
				animateValue(0, data?.vehicle, 1, 'vehicle');
				animateValue(0, data?.renter, 1, 'renter');
				animateValue(0, data?.partner, 1, 'partner');
			}
		} catch (error) {
			dispatch(setAlert(error?.message, 'Error'));
		}
	};

	function animateValue(start, end, duration, field) {
		if (start === end) return;
		var range = end - start;
		var current = start;
		var increment = end > start ? 1 : -1;
		var stepTime = Math.abs(Math.floor(duration / range));
		// var obj = document.getElementById(id);

		var timer = setInterval(function () {
			current += increment;
			field === 'vehicle' && setVehicle(current);
			field === 'renter' && setRenter(current);
			field === 'partner' && setPartner(current);
			//     obj.innerHTML = current;
			if (current === end) {
				clearInterval(timer);
			}
		}, stepTime);
	}

	// animateValue("value", 100, 25, 5000);

	return (
		<PageWrapper title='Dashboard'>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-md-3'>
						<Card stretch>
							<CardHeader>
								<CardLabel icon='Vehicle' iconColor='dark'>
									<CardTitle tag='h4' className='h5'>
										Vehicle
									</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<CardLabel>
									<CardTitle tag='h4' className='h5' style={{ fontSize: '25px' }}>
										{/* {_.get(data, "vehicle", "00")} */}
										{vehicle ? vehicle : '0'}
									</CardTitle>
								</CardLabel>
							</CardBody>
						</Card>
					</div>
					<div className='col-md-3'>
						<Card stretch>
							<CardHeader>
								<CardLabel icon='People' iconColor='dark'>
									<CardTitle tag='h4' className='h5'>
										Residenters
									</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<CardLabel>
									<CardTitle tag='h4' className='h5' style={{ fontSize: '25px' }}>
										{/* {_.get(data, "vehicle", "00")} */}
										{renter ? renter : '0'}
									</CardTitle>
								</CardLabel>
							</CardBody>
						</Card>
					</div>
					<div className='col-md-3'>
						<Card stretch>
							<CardHeader>
								<CardLabel icon='Person' iconColor='dark'>
									<CardTitle tag='h4' className='h5'>
										Citations
									</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<CardLabel>
									<CardTitle tag='h4' className='h5' style={{ fontSize: '25px' }}>
										{/* {_.get(data, "vehicle", "00")} */}
										{partner ? partner : '0'}
									</CardTitle>
								</CardLabel>
							</CardBody>
						</Card>
					</div>
					<div className='col-md-3'>
						<Card stretch>
							<CardHeader>
								<CardLabel icon='Vehicle' iconColor='dark'>
									<CardTitle tag='h4' className='h5'>
										Active Guests
									</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<CardLabel>
									<CardTitle tag='h4' className='h5' style={{ fontSize: '25px' }}>
										{/* {_.get(data, "vehicle", "00")} */}
										{vehicle ? vehicle : '0'}
									</CardTitle>
								</CardLabel>
							</CardBody>
						</Card>
					</div>
				</div>

				{/* ##################################faizan works##############  */}

				<div className='row'>
				
					<div className='col-md-3'>
						<Card stretch>
							<CardHeader>
								<CardLabel icon='People' iconColor='dark'>
									<CardTitle tag='h4' className='h5'>
										Spaces
									</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<CardLabel>
									<CardTitle tag='h4' className='h5' style={{ fontSize: '25px' }}>
										{/* {_.get(data, "vehicle", "00")} */}
										{renter ? renter : '0'}
									</CardTitle>
								</CardLabel>
							</CardBody>
						</Card>
					</div>
					<div className='col-md-3'>
						<Card stretch>
							<CardHeader>
								<CardLabel icon='Person' iconColor='dark'>
									<CardTitle tag='h4' className='h5'>
										Guest Spaces
									</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<CardLabel>
									<CardTitle tag='h4' className='h5' style={{ fontSize: '25px' }}>
										{/* {_.get(data, "vehicle", "00")} */}
										{partner ? partner : '0'}
									</CardTitle>
								</CardLabel>
							</CardBody>
						</Card>
					</div>
					<div className='col-md-3'>
						<Card stretch>
							<CardHeader>
								<CardLabel icon='Vehicle' iconColor='dark'>
									<CardTitle tag='h4' className='h5'>
										Resident Spaces
									</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<CardLabel>
									<CardTitle tag='h4' className='h5' style={{ fontSize: '25px' }}>
										{/* {_.get(data, "vehicle", "00")} */}
										{vehicle ? vehicle : '0'}
									</CardTitle>
								</CardLabel>
							</CardBody>
						</Card>
					</div>
					<div className='col-md-3'>
						<Card stretch>
							<CardHeader>
								<CardLabel icon='People' iconColor='dark'>
									<CardTitle tag='h4' className='h5'>
										Occupied Guest
									</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<CardLabel>
									<CardTitle tag='h4' className='h5' style={{ fontSize: '25px' }}>
										{/* {_.get(data, "vehicle", "00")} */}
										{renter ? renter : '0'}
									</CardTitle>
								</CardLabel>
							</CardBody>
						</Card>
					</div>
				</div>

				<div className='row'>
					

					<div className='col-md-3'>
						<Card stretch>
							<CardHeader>
								<CardLabel icon='Person' iconColor='dark'>
									<CardTitle tag='h4' className='h5'>
										Occupied Residents
									</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<CardLabel>
									<CardTitle tag='h4' className='h5' style={{ fontSize: '25px' }}>
										{/* {_.get(data, "vehicle", "00")} */}
										{partner ? partner : '0'}
									</CardTitle>
								</CardLabel>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default Dashboard;
