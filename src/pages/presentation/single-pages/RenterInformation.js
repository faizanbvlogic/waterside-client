import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Pagination } from 'antd';
import moment from 'moment';
import * as api from '../../../api';
import Button from '../../../components/bootstrap/Button';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import {
	setAlert,
	setLoading,
	setVehiclePreviewPage,
	setPartnerPreviewPage,
} from '../../../globalState/action-creators';
import Modal from '../../../utils/Modal';

const Actions = ['Info', 'Edit', 'Delete'];

const RenterInformation = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const search = useLocation().search;
	const token = localStorage.getItem('token');
	useEffect(() => {
		if (!token) {
			navigate('/auth-pages/login', { replace: true });
		}
		dispatch(setPartnerPreviewPage({ partnerPage: 1 }));
		dispatch(setVehiclePreviewPage({ vehiclePage: 1 }));
		fetchRenters();
		// eslint-disable-next-line
	}, []);

	const [rentersData, setRentersData] = useState([]);

	// FOR PAGINATION
	const [paginationData, setPaginationData] = useState({
		total: 0,
		currentPage: 1,
		pageSize: 10,
	});

	// FOR MODAL TOGGLE
	const [isActiveModal, setIsActiveModal] = useState(false);
	const [renterId, setRenterId] = useState(null);

	// Fetch renter's data
	const fetchRenters = async (isPage, isSize) => {
		dispatch(setLoading(true));
		const page =
			isPage ||
			new URLSearchParams(search).get('page') ||
			_.get(paginationData, 'currentPage', '1');
		const size =
			isSize ||
			new URLSearchParams(search).get('size') ||
			_.get(paginationData, 'pageSize', '10');
		try {
			const { data } = await api.getRenters(`page=${page}&size=${size}`);
			if (data?.success) {
				setRentersData(_.get(data, 'renters', { ...rentersData }));
				setPaginationData({
					...paginationData,
					total: data?.total || paginationData?.total,
					currentPage: page,
					pageSize: size,
				});
			} else {
				dispatch(setAlert(data?.message, 'Error'));
			}
		} catch (error) {
			dispatch(setAlert(error?.message, 'Error'));
		}
		dispatch(setLoading(false));
	};

	const onPageChanged = (page) => {
		fetchRenters(page);
	};

	const openDeleteModal = (_id) => {
		setRenterId(_id);
		setIsActiveModal(true);
	};

	// for delete a vehicle
	const deleteRenter = async () => {
		try {
			const { data } = await api.deleteRenter(renterId);
			if (data?.success) {
				fetchRenters(Math.ceil((paginationData?.total - 1) / paginationData?.pageSize));
				setIsActiveModal(false);
			} else {
				dispatch(setAlert(data?.message, 'Error'));
			}
		} catch (error) {
			dispatch(setAlert(error?.message, 'Error'));
		}
	};

	return (
		<>
			<PageWrapper title={'Renters Info'}>
				<Page container='fluid'>
					<div className='row'>
						<div className='col-xxl-6'>
							<Card stretch>
								<CardHeader>
									<CardLabel icon='Person' iconColor='dark'>
										<CardTitle tag='h4' className='h5'>
											Users
										</CardTitle>
									</CardLabel>
									<CardActions>
										<Button
											color='primary'
											isLight
											icon='Plus'
											onClick={() => {
												navigate('/residents_information/create');
											}}
										>
											Add Resident
										</Button>
									</CardActions>
								</CardHeader>
								<CardBody className='table-responsive'>
									<table className='table table-modern table-hover text-center'>
										<thead>
											<tr>
												<th
													scope='col'
													className='cursor-pointer text-decoration-none'
												>
													#
												</th>

												<th
													scope='col'
													className='cursor-pointer text-decoration-none'
												>
													Name
												</th>
												<th
													scope='col'
													className='cursor-pointer text-decoration-none'
												>
													Phone Number
												</th>
												<th
													scope='col'
													className='cursor-pointer text-decoration-none'
												>
													Email
												</th>
												<th
													scope='col'
													className='cursor-pointer text-decoration-none'
												>
													License Plate
												</th>
											
												<th
													scope='col'
													className='cursor-pointer text-decoration-none'
												>
													Units
												</th>
												<th
													scope='col'
													className='cursor-pointer text-decoration-none'
												>
													Make
												</th>
												<th
													scope='col'
													className='cursor-pointer text-decoration-none'
												>
													Model
												</th>

											
												<th
													scope='col'
													className='cursor-pointer text-decoration-none'
												>
													Move In Date
												</th>
												<th
													scope='col'
													className='cursor-pointer text-decoration-none'
												>
													Move Out Date
												</th>
											
												<th
													scope='col'
													className='cursor-pointer text-decoration-none'
												>
													Registration Type
												</th>
											</tr>
										</thead>
										<tbody>
											{rentersData &&
												rentersData?.length > 0 &&
												rentersData.map((i, index) => {
													return (
														<tr key={index} className='hover-bg'>
															{/* <th scope='row'>{((perPage * (currentPage - 1)) + index) + 1}</th> */}
															<th scope='row'>
																{paginationData?.pageSize *
																	(paginationData?.currentPage -
																		1) +
																	index +
																	1}
															</th>
															<td className='no_wrap'>
																{_.get(i, 'firstName', '')?.length >
																	0 &&
																_.get(i, 'lastName', '')?.length > 0
																	? _.get(i, 'firstName', '') +
																	  ' ' +
																	  _.get(i, 'lastName', '')
																	: '-'}
															</td>
															<td className='breakline'>
																{_.get(i, 'phoneNumber', '')
																	?.length > 0
																	? _.get(i, 'phoneNumber', '')
																	: '-'}
															</td>
															<td className='no_wrap'>
																{_.get(i, 'dateOfBirth', '')
																	?.length > 0
																	? _.get(i, 'dateOfBirth', '')
																	: '-'}
															</td>
															<td className='break_word'>
																{_.get(i, 'street_address', '')
																	?.length > 0
																	? _.get(i, 'street_address', '')
																	: '-'}
															</td>
															<td>
																{_.get(i, 'city', '')?.length > 0
																	? _.get(i, 'city', '')
																	: '-'}
															</td>
															<td>
																{_.get(i, 'state', '')?.length > 0
																	? _.get(i, 'state', '')
																	: '-'}
															</td>
															<td>
																{_.get(
																	i,
																	'license_expiration_date',
																	'',
																)?.length > 0
																	? moment(
																			_.get(
																				i,
																				'license_expiration_date',
																				'',
																			),
																	  ).format('MM/DD/YYYY')
																	: '-'}
															</td>
															<td>
																{_.get(i, 'zipcode', '')?.length > 0
																	? _.get(i, 'zipcode', '')
																	: '-'}
															</td>

															<td>
																<div className='flexbtn'>
																	{Actions.map((e) => {
																		return (
																			<Button
																				key={e}
																				style={{
																					width: '36px',
																					margin: '2px',
																				}}
																				color='primary'
																				isLight
																				icon={
																					e !== 'Info'
																						? e
																						: 'Eye'
																				}
																				onClick={() => {
																					e === 'Info' &&
																						navigate(
																							`/residents_information/detail/${i._id}`,
																						);
																					e ===
																						'Delete' &&
																						openDeleteModal(
																							i._id,
																						);
																					e === 'Edit' &&
																						navigate(
																							`/residents_information/edit/${i._id}`,
																						);
																				}}
																			/>
																		);
																	})}
																</div>
															</td>
														</tr>
													);
												})}
										</tbody>
									</table>
								</CardBody>

								<Pagination
									hideOnSinglePage
									onChange={onPageChanged}
									current={_.get(paginationData, 'currentPage', '1')}
									pageSize={_.get(paginationData, 'pageSize', '10')}
									defaultCurrent={1}
									total={_.get(paginationData, 'total', '0')}
									showSizeChanger={false}
								/>
							</Card>
						</div>
					</div>
				</Page>
			</PageWrapper>
			<Modal
				onSubmit={() => deleteRenter()}
				onClose={() => setIsActiveModal(false)}
				show={isActiveModal}
				title={'Delete Renter!'}
			/>
		</>
	);
};

export default RenterInformation;
