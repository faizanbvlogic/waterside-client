import * as React from 'react';

function SvgTitle(props) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			height='1em'
			viewBox='0 0 24 24'
			width='1em'
			className='svg-icon'
			{...props}>
			<path d='M0 0h24v24H0V0z' fill='none' />
			<path d='M5 7h5.5v12h3V7H19V4H5z' />
		</svg>
	);
}

export default SvgTitle;
