import React from 'react';
import Header, { HeaderLeft } from '../../../layout/Header/Header';
// import Avatar from '../../../components/Avatar';
// import UserImage2Webp from '../../../assets/img/wanna/wanna1.webp';
// import UserImage2 from '../../../assets/img/wanna/wanna1.png';

const ProfilePageHeader = () => {
	return (
		<Header>
			<HeaderLeft>
				<div className='col d-flex align-items-center'>
					<div className='me-3'>

						{/* <Avatar
							srcSet={UserImage2Webp}
							src={UserImage2}
							size={48}
							color='primary'
						/> */}
					</div>
				</div>
			</HeaderLeft>
		</Header>
	);
};

export default ProfilePageHeader;
