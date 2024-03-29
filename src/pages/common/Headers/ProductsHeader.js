import React from 'react';
import Header, { HeaderLeft } from '../../../layout/Header/Header';
import Navigation from '../../../layout/Navigation/Navigation';
import { productsMenu } from '../../../menu';
import useDeviceScreen from '../../../hooks/useDeviceScreen';

const ProductsHeader = () => {
	const deviceScreen = useDeviceScreen();
	return (
		<Header>
			<HeaderLeft>
				<Navigation
					menu={productsMenu}
					id='products-top-menu'
					horizontal={deviceScreen?.width >= process.env.REACT_APP_MOBILE_BREAKPOINT_SIZE}
				/>
			</HeaderLeft>
		</Header>
	);
};

export default ProductsHeader;
