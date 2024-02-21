import React, { useContext, useEffect, useLayoutEffect, useRef } from 'react';
import { ThemeProvider } from 'react-jss';
import { useFullscreen } from 'react-use';
import { Route, Routes } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import { TourProvider } from '@reactour/tour';
import ThemeContext from '../contexts/themeContext';
import Aside from '../layout/Aside/Aside';
import Wrapper from '../layout/Wrapper/Wrapper';
import { Toast, ToastContainer } from '../components/bootstrap/Toasts';
import useDarkMode from '../hooks/useDarkMode';
import COLORS from '../common/data/enumColors';
import { getOS } from '../helpers/helpers';
import steps, { styles } from '../steps';

const App = () => {
  getOS();

  /**
   * Dark Mode
   */
  const { themeStatus, darkModeStatus } = useDarkMode();
  const theme = {
    theme: themeStatus,
    primary: COLORS.PRIMARY.code,
    secondary: COLORS.SECONDARY.code,
    success: COLORS.SUCCESS.code,
    info: COLORS.INFO.code,
    warning: COLORS.WARNING.code,
    danger: COLORS.DANGER.code,
    dark: COLORS.DARK.code,
    light: COLORS.LIGHT.code,
  };

  useEffect(() => {
    if (darkModeStatus) {
      document.documentElement.setAttribute('theme', 'dark');
    }
    return () => {
      document.documentElement.removeAttribute('theme');
    };
  }, [darkModeStatus]);

  /**
   * Full Screen
   */
  const { fullScreenStatus, setFullScreenStatus } = useContext(ThemeContext);
  const ref = useRef(null);
  useFullscreen(ref, fullScreenStatus, {
    onClose: () => setFullScreenStatus(false),
  });

  /**
   * Modern Design
   */
  useLayoutEffect(() => {
    if (process.env.REACT_APP_MODERN_DESGIN === 'true') {
      document.body.classList.add('modern-design');
    } else {
      document.body.classList.remove('modern-design');
    }
  });

  //	Add paths to the array that you want to be "Aside".
  const withAsidePages = [
    // resourcePages.login.path,
    // 'auth-pages/sign-up',
    // 'page-layouts/blank',
    '/',
    'vehicles',
    'vehicles/create',
    'vehicles/edit/:id',
    'vehicles/detail/:id',
    'residents_information',
    'partners/edit/:id',
    'residents_information/create',
    'residents_information/detail/:id',
    'residents_information/edit/:id',
    'revenue',
    'revenue/detail/:id',
    'reservation',
    'reservation/update/:id',
    'reservation/detail/:id',
    "rates",
    "rates/change_rates",
    "change_price/edit/:id/:index",
    'change_price/edit/per_hour/:id/:index',
    'change_price/detail/:id',
    "change_price/detail",
    "book_moke",
    "hold_moke",
    "hold_moke/add",
    "change_price",
    'single-pages/fluid',
    'single-pages/vehicle-colors',
    'single-pages/vehicle-rentals',
    'single-pages/cancellation-Requests',
    'partners',
    'partners/create',
    'partners/detail/:id',
    'associates/mokes', 
    'change_rates',
    'hold_moke/detail/:id',
    'hold_moke/edit/:id',
  ];

  return (
    <ThemeProvider theme={theme}>
      <ToastProvider components={{ ToastContainer, Toast }}>
        <TourProvider
          steps={steps}
          styles={styles}
          showNavigation={false}
          showBadge={false}>
          <div
            ref={ref}
            className='app'
            style={{
              backgroundColor: fullScreenStatus && 'var(--bs-body-bg)',
              zIndex: fullScreenStatus && 1,
              overflow: fullScreenStatus && 'scroll',
            }}>
            <Routes>
              {withAsidePages.map((path) => (
                <Route key={path} path={path} element={<Aside />} />
              ))}
              <Route path='*' />
            </Routes>
            <Wrapper />
          </div>
          {/* <Portal id='portal-notification'>
            <ReactNotifications />
          </Portal> */}
        </TourProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;

// 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
