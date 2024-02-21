import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from '../../pages/presentation/auth/Login';
import contents, { partnerContents } from '../../routes/contentRoutes';
import { USER_ROLE } from '../../constants';

const PAGE_404 = lazy(() => import('../../pages/presentation/auth/Page404'));
const ContentRoutes = () => {

  const user = useSelector(state => state?.user);
  let content_;
  if (user?.role && user?.role?.length > 0 && user?.role === USER_ROLE?.PARTNER) {
    content_ = partnerContents
  }
  else {
    content_ = contents
  }

  return (
    <Routes>
      {content_.map((page) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Route key={page.path} {...page} />

      ))}
      <Route path='auth-pages/login' element={<Login />} />
      <Route path='*' element={<PAGE_404 />} />
    </Routes>
  );
};

export default ContentRoutes;
