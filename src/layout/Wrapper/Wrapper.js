import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Content from '../Content/Content';
import WrapperOverlay from './WrapperOverlay';
import HeaderRoutes from '../Header/HeaderRoutes';
import FooterRoutes from '../Footer/FooterRoutes';
import ThemeContext from '../../contexts/themeContext';
import Alert from '../../utils/alert/Alert'
import Loading from '../../utils/loading/Loading'

export const WrapperContainer = ({ children, className, ...props }) => {
	const { rightPanel } = useContext(ThemeContext);
	return (
		<div
			className={classNames(
				'wrapper',
				{ 'wrapper-right-panel-active': rightPanel },
				className,
			)}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}>
			{children}
		</div>
	);
};
WrapperContainer.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};
WrapperContainer.defaultProps = {
	className: null,
};

const Wrapper = () => {
	const isLoading = useSelector(state => state?.loading?.isLoading)
	const isAlert = useSelector(state => state?.alert?.message)
	return (
		<>
			{isLoading && <Loading />}
			{isAlert && <Alert />}
			<WrapperContainer>
				<HeaderRoutes />
				<Content />
				<FooterRoutes />
			</WrapperContainer>
			<WrapperOverlay />
		</>
	);
};

export default Wrapper;
