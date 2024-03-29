import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux'
import { setAlert } from '../../../globalState/action-creators'
import * as api from '../../../api'
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
// import Logo from '../../../components/Logo';
import useDarkMode from '../../../hooks/useDarkMode';
import { setAccount } from '../../../globalState/action-creators';
import { USER_ROLE } from '../../../constants';

// eslint-disable-next-line react/prop-types
const LoginHeader = ({ isNewUser }) => {
	if (isNewUser) {
		return (
			<>
				<div className='text-center h3 fw-bold mt-5'>Create Account,</div>
				<div className='text-center h4 text-muted mb-5'>Sign up to get started!</div>
			</>
		);
	}
	return (
		<>
			<div className='text-center h3 fw-bold mt-5'>Welcome,</div>
			<div className='text-center h4 text-muted mb-5'>Sign in to continue!</div>
		</>
	);
};

const Login = ({ isSignUp }) => {
	const dispatch = useDispatch();
	const { darkModeStatus } = useDarkMode();

	const [usernameInput, setUsernameInput] = useState(false);
	const [isNewUser, setIsNewUser] = useState(isSignUp || true);

	const navigate = useNavigate();
	const handleOnClick = useCallback(() => navigate('/'), [navigate]);

	const [loginData, setLoginData] = useState({ email: '', password: '' })

	// onChange for email and password
	const onChange = (e) => {
		const { name, value } = e.target;
		setLoginData(
			{
				...loginData,
				[name]: value
			}
		)
	}

	// submit login 
	const submitLogin = async () => {
		try {
			const { data } = await api.login(loginData)
			if (data.success) {
				localStorage.setItem('token', data?.token)
				dispatch(setAccount({ email: data?.user?.email, role: data?.user?.role, _id: data?.user?._id }))
				data?.user?.role === USER_ROLE?.PARTNER && navigate('/reservation');
				data?.user?.role === USER_ROLE?.ADMIN && navigate('/');
			    data?.user?.role === USER_ROLE?.SUPER_ADMIN && navigate('/');
			}
			else {
				dispatch(setAlert(data.message, "Error"))
			}
		} catch (error) {
			dispatch(setAlert(error.message, "Error"))
		}
	}

	return (
		<PageWrapper
			title={!isNewUser ? 'Sign Up' : 'Login'}
			className={classNames({
				'bg-white': !!isNewUser, 'bg-info': !!isNewUser
			})}>
			<Page className='p-0'>
				<div className='row h-100 align-items-center justify-content-center'>
					<div className='col-xl-4 col-lg-6 col-md-8 shadow-3d-container'>
						<Card data-tour='login-page'>
							<CardBody>
								<div className='text-center my-5'>
									<Link
										to='/'
										className={classNames(
											'text-decoration-none  fw-bold display-2',
											{
												'text-dark': !darkModeStatus,
												'text-light': darkModeStatus,
											},
										)}>
										{/* <Logo width={200} /> */}
										<h1 className='text-center h1 fw-bold mt-5'>WeMoke</h1>
									</Link>
								</div>
								<div
									className={classNames('rounded-3', {
										'bg-l10-dark': !darkModeStatus,
										'bg-lo10-dark': darkModeStatus,
									})}>
									<div className='row row-cols-2 g-3 pb-3 px-3 mt-0'>
										<div className='col'>
											<Button
												color={darkModeStatus ? 'light' : 'dark'}
												isLight={!isNewUser}
												className='rounded-1 w-100'
												size='lg'
												onClick={() => {
													setUsernameInput(false);
													setIsNewUser(!isNewUser);
												}}>
												Login
											</Button>
										</div>
										<div className='col'>
											<Button
												color={darkModeStatus ? 'light' : 'dark'}
												isLight={!!isNewUser}
												className='rounded-1 w-100'
												size='lg'
												onClick={() => {
													setUsernameInput(false);
													setIsNewUser(!isNewUser);
												}}>
												Sign Up
											</Button>
										</div>
									</div>
								</div>

								<LoginHeader isNewUser={!isNewUser} />

								<form className='row g-4'>
									{!isNewUser ? (
										<>
											<div className='col-12'>
												<FormGroup
													id='signup-email'
													isFloating
													label='Your email'>
													<Input type='email' autoComplete='email' />
												</FormGroup>
											</div>
											<div className='col-12'>
												<FormGroup
													id='signup-name'
													isFloating
													label='Your name'>
													<Input autoComplete='given-name' />
												</FormGroup>
											</div>
											<div className='col-12'>
												<FormGroup
													id='signup-surname'
													isFloating
													label='Your surname'>
													<Input autoComplete='family-name' />
												</FormGroup>
											</div>
											<div className='col-12'>
												<FormGroup
													id='signup-password'
													isFloating
													label='Password'>
													<Input
														type='password'
														autoComplete='password'
													/>
												</FormGroup>
											</div>
											<div className='col-12'>
												<Button
													color='dark'
													className='w-100 py-3'
													onClick={handleOnClick}>
													Sign Up
												</Button>
											</div>
										</>
									) : (
										<>
											<div className='col-12'>
												{!usernameInput ? (
													<>
														<FormGroup
															id='email'
															isFloating
															label='Your email'>
															<Input
																autoComplete='username'
																onChange={onChange}
																value={loginData.email}
															/>
														</FormGroup>
														<FormGroup
															className="mt-3"
															id='password'
															isFloating
															label='Your password'>
															<Input
																autoComplete='off'
																type='password'
																onChange={onChange}
																value={loginData.password}
															/>
														</FormGroup>
													</>
												) : (
													<FormGroup
														id='login-password'
														isFloating
														label='Password'>
														<Input
															type='password'
															autoComplete='password'
														/>
													</FormGroup>
												)}
											</div>
											<div className='col-12'>
												{/* {!usernameInput ? ( */}
												{/* <Button
														color='warning'
														className='w-100 py-3'
														onClick={() => setUsernameInput(true)}>
														Continue
													</Button> */}
												{/* ) : ( */}
												<Button
													color='dark'
													className='w-100 py-3'
													onClick={submitLogin}>
													Login
												</Button>
												{/* )} */}
											</div>
										</>
									)}

									{/* BEGIN :: Social Login */}
									{/* {!usernameInput && (
										<>
											<div className='col-12 mt-3 text-center text-muted'>
												OR
											</div>
											<div className='col-12 mt-3'>
												<Button
													isOutline
													color={darkModeStatus ? 'light' : 'dark'}
													className={classNames('w-100 py-3', {
														'border-light': !darkModeStatus,
														'border-dark': darkModeStatus,
													})}
													icon='CustomApple'
													onClick={handleOnClick}>
													Sign in with Apple
												</Button>
											</div>
											<div className='col-12'>
												<Button
													isOutline
													color={darkModeStatus ? 'light' : 'dark'}
													className={classNames('w-100 py-3', {
														'border-light': !darkModeStatus,
														'border-dark': darkModeStatus,
													})}
													icon='CustomGoogle'
													onClick={handleOnClick}>
													Continue with Google
												</Button>
											</div>
										</>
									)} */}
									{/* END :: Social Login */}
								</form>
							</CardBody>
						</Card>
						<div className='text-center'>
							<a
								href='/'
								className={classNames('text-decoration-none me-3', {
									'link-light': isNewUser,
									'link-dark': !isNewUser,
								})}>
								Privacy policy
							</a>
							<a
								href='/'
								className={classNames('link-light text-decoration-none', {
									'link-light': isNewUser,
									'link-dark': !isNewUser,
								})}>
								Terms of use
							</a>
						</div>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};
Login.propTypes = {
	isSignUp: PropTypes.bool,
};
Login.defaultProps = {
	isSignUp: false,
};

export default Login;
