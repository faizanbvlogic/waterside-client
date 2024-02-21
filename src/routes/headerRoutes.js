import React from 'react';
import {
  componentsMenu, dashboardMenu,
} from '../menu';
import DashboardHeader2 from '../pages/common/Headers/DashboardHeader2';
import VehicleHeader from '../pages/common/Headers/VehicleHeader';
import DashboardBookingHeader from '../pages/common/Headers/DashboardBookingHeader';
import ProfilePageHeader from '../pages/common/Headers/ProfilePageHeader';
// import SummaryHeader from '../pages/common/Headers/SummaryHeader';
import ProductsHeader from '../pages/common/Headers/ProductsHeader';
import ProductListHeader from '../pages/common/Headers/ProductListHeader';
import PageLayoutHeader from '../pages/common/Headers/PageLayoutHeader';
import ComponentsHeader from '../pages/common/Headers/ComponentsHeader';
import ChartsHeader from '../pages/common/Headers/ChartsHeader';
import ContentHeader from '../pages/common/Headers/ContentHeader';
import UtilitiesHeader from '../pages/common/Headers/UtilitiesHeader';
import IconHeader from '../pages/common/Headers/IconHeader';
import ExtrasHeader from '../pages/common/Headers/ExtrasHeader';
import DefaultHeader from '../pages/common/Headers/DefaultHeader';

const headers = [
  { path: 'page-layouts/only-subheader', element: null, exact: true },
  { path: 'page-layouts/only-content', element: null, exact: true },
  { path: 'page-layouts/blank', element: null, exact: true },
  { path: 'auth-pages/login', element: null, exact: true },
  { path: 'auth-pages/sign-up', element: null, exact: true },
  // { path: demoPages.page404.path, element: null, exact: true },
  // { path: demoPages.knowledge.subMenu.grid.path, element: null, exact: true },
  // { path: dashboardMenu.dashboard.path, element: <DashboardHeader />, exact: true },
  { path: dashboardMenu.dashboard.path, element: <DashboardHeader2 />, exact: true },
  // {
  // 	path: demoPages.projectManagement.subMenu.list.path,
  // 	element: <DashboardHeader />,
  // 	exact: true,
  // },
  // { path: demoPages.pricingTable.path, element: <DashboardHeader />, exact: true },
  {
    path: dashboardMenu.vehicleInventory.path,
    element: <DashboardHeader2 />,
    exact: true,
  },
  {
    path: dashboardMenu.Renter.path,
    element: <DashboardHeader2 />,
    exact: true,
  },

  {
    path: 'partners',
    element: <DashboardHeader2 />,
    exact: true,
  },
  {
    path: 'partners/create',
    element: null,
    exact: true,
  },
  {
    path: 'partners/detail/:id',
    element: null,
    exact: true,
  },
  {
    path: 'associates/mokes',
    element: <DashboardHeader2 />,
    exact: true,
  },
  // {
  // 	path: demoPages.appointment.subMenu.calendar.path,
  // 	element: <DashboardBookingHeader />,
  // 	exact: true,
  // },
  // {
  // 	path: demoPages.appointment.subMenu.employeeList.path,
  // 	element: <DashboardBookingHeader />,
  // 	exact: true,
  // },
  {
    path: 'list-pages/fluid-list',
    element: <DashboardBookingHeader />,
    exact: true,
  },
  // {
  // 	path: `${demoPages.editPages.path}/*`,
  // 	element: <DashboardBookingHeader />,
  // 	exact: true,
  // },
  // {
  // 	path: `${demoPages.appointment.subMenu.employeeID.path}/*`,
  // 	element: <DashboardBookingHeader />,
  // 	exact: true,
  // },
  // {
  // 	path: `${demoPages.projectManagement.subMenu.itemID.path}/*`,
  // 	element: <DashboardBookingHeader />,
  // 	exact: true,
  // },
  {
    path: 'single-pages/fluid',
    element: <ProfilePageHeader />,
    exact: true,
  },
  {
    path: 'single-pages/boxed',
    element: <ProfilePageHeader />,
    exact: true,
  },
  {
    path: 'vehicles',
    element: <VehicleHeader />,
    exact: true,
  },
  {
    path: 'vehicles/create',
    element: null,
    exact: true,
  },
  {
    path: 'vehicles/edit/:id',
    element: null,
    exact: true,
  },
  {
    path: 'vehicles/detail/:id',
    element: null,
    exact: true,
  },
  {
    path: `${dashboardMenu.Renter.path}/detail/:id`,
    element: null,
    exact: true,
  },
  {
    path: `${dashboardMenu.Renter.path}/edit/:id`,
    element: null,
    exact: true,
  },
  {
    path: `${dashboardMenu.Renter.path}/create`,
    element: null,
    exact: true,
  },
  {
    path: 'revenue',
    element: <DashboardHeader2 />,
    exact: true,
  },
  {
    path: 'revenue/detail/:id',
    element: null,
    exact: true,
  },
  {
    path: 'reservation',
    element: <DashboardHeader2 />,
    exact: true,
  },
  {
    path: `reservation/update/:id`,
    element: null,
    exact: true,
  },
  {
    path: `reservation/detail/:id`,
    element: null,
    exact: true,
  },
  {
    path: `rates`,
    element: null,
    exact: true,
  },
  {
    path: `rates/change_price`,
    element: null,
    exact: true,
  },
  {
    path: `change_price/edit/:id/:index`,
    element: null,
    exact: true,
  },
  {
    path: `change_price/edit/per_hour/:id/:index`,
    element: null,
    exact: true,
  },
  {
    path: 'change_price/detail/:id',
    element: null,
    exact: true,
  },
  {
    path: `book_moke`,
    element: null,
    exact: true,
  },
  {
    path: `hold_moke`,
    element: <VehicleHeader />,
    exact: true,
  },
  {
    path: `hold_moke/add`,
    element: null,
    exact: true,
  },
  {
    path: `change_price`,
    element: null,
    exact: true,
  },
  {
    path: 'partners/edit/:id',
    element: null,
    exact: true,
  },
  {
    path: 'hold_moke/detail/:id',
    element: null,
    exact: true,
  },
  {
    path: 'hold_moke/edit/:id',
    element: null,
    exact: true,
  },

  /**
   * CHATBOT
   */

  {
    path: "/chatbot/renter",
    element: null,
    exact: true
  },
  {
    path: "/chatbot",
    element: null,
    exact: true
  },
  {
    path: "/chatbot/delivery",
    element: null,
    exact: true
  },
  {
    path: "/chatbot/slots",
    element: null,
    exact: true
  },

  // {
  // 	path: demoPages.sales.subMenu.transactions.path,
  // 	element: <ProfilePageHeader />,
  // 	exact: true,
  // },
  // {
  // 	path: demoPages.chat.subMenu.withListChat.path,
  // 	element: <ProfilePageHeader />,
  // 	exact: true,
  // },
  // {
  // 	path: demoPages.chat.subMenu.onlyListChat.path,
  // 	element: <ProfilePageHeader />,
  // 	exact: true,
  // },
  // {
  // 	path: `${demoPages.knowledge.subMenu.itemID.path}/:id`,
  // 	element: <ProfilePageHeader />,
  // 	exact: true,
  // },
  // {
  // 	path: demoPages.crm.subMenu.dashboard.path,
  // 	element: <ProfilePageHeader />,
  // 	exact: true,
  // },
  // {
  // 	path: demoPages.crm.subMenu.customersList.path,
  // 	element: <ProfilePageHeader />,
  // 	exact: true,
  // },
  // {
  // 	path: `${demoPages.crm.subMenu.customerID.path}/:id`,
  // 	element: <ProfilePageHeader />,
  // 	exact: true,
  // },
  // {
  // 	path: dashboardMenu.summary.path,
  // 	element: <SummaryHeader />,
  // 	exact: true,
  // },
  {
    path: 'grid-pages/boxed',
    element: <ProductsHeader />,
    exact: true,
  },
  {
    path: 'grid-pages/fluid',
    element: <ProductsHeader />,
    exact: true,
  },
  {
    path: 'list-pages/boxed-list',
    element: <ProductListHeader />,
    exact: true,
  },
  // {
  // 	path: demoPages.sales.subMenu.salesList.path,
  // 	element: <ProductListHeader />,
  // 	exact: true,
  // },
  // {
  // 	path: demoPages.sales.subMenu.productsGrid.path,
  // 	element: <ProductListHeader />,
  // 	exact: true,
  // },
  // {
  // 	path: `${demoPages.sales.subMenu.productID.path}/:id`,
  // 	element: <ProductListHeader />,
  // 	exact: true,
  // },
  {
    path: 'aside-types/*',
    element: <PageLayoutHeader />,
    exact: true,
  },
  {
    path: 'page-layouts/header-and-subheader',
    element: <PageLayoutHeader />,
    exact: true,
  },
  {
    path: 'page-layouts/only-header',
    element: <PageLayoutHeader />,
    exact: true,
  },
  {
    path: `${componentsMenu.components.path}/*`,
    element: <ComponentsHeader />,
  },
  {
    path: `${componentsMenu.charts.path}/*`,
    element: <ChartsHeader />,
  },
  {
    path: `${componentsMenu.content.path}/*`,
    element: <ContentHeader />,
  },
  {
    path: `${componentsMenu.utilities.path}/*`,
    element: <UtilitiesHeader />,
  },
  {
    path: `${componentsMenu.icons.path}/*`,
    element: <IconHeader />,
  },
  {
    path: `${componentsMenu.extra.path}/*`,
    element: <ExtrasHeader />,
  },
  {
    path: `*`,
    element: <DefaultHeader />,
  },
];


export default headers;
