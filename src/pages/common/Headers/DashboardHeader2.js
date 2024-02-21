import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header, { HeaderLeft, HeaderRight } from '../../../layout/Header/Header';
// import CommonHeaderChat from './CommonHeaderChat';
import Search from '../../../components/Search';
import Button from '../../../components/bootstrap/Button';
// import Card, { CardActions, CardHeader } from '../../../components/bootstrap/Card';
// import CommonHeaderRight from './CommonHeaderRight';
import { USER_ROLE } from '../../../constants'

const DashboardHeader2 = () => {

  const user = useSelector(state => state?.user);
  const navigate = useNavigate();

  return (
    <Header>
      <HeaderLeft>
        {
          user?.role &&
          user?.role?.length > 0 &&
          user?.role !== USER_ROLE?.PARTNER &&
          <Search />
        }
      </HeaderLeft>
      <HeaderRight>

        <Button
          color='primary'
          isLight
          onClick={() => {
            localStorage.removeItem('token')
            navigate('/auth-pages/login')
          }}>
          Logout
        </Button>

      </HeaderRight>
      {/* <CommonHeaderRight afterChildren={<CommonHeaderChat />} /> */}
    </Header>
  );
};

export default DashboardHeader2;
