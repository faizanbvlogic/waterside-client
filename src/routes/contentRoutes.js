import React, { lazy } from 'react';
import {
  componentsMenu, dashboardMenu,
  // demoPages,
  // resourcePages,
  //  layoutMenu 
} from '../menu';
import Login from '../pages/presentation/auth/Login';
import AddVehicle from '../pages/presentation/buttonsPages/AddVehicle';
import AddPartner from '../pages/presentation/buttonsPages/AddPartner';
import DetailPartner from '../pages/presentation/buttonsPages/DetailPartner';
import EditVehicle from '../pages/presentation/buttonsPages/EditVehicle';
import EditPartner from '../pages/presentation/buttonsPages/EditPartner';
import DetailVehicle from '../pages/presentation/buttonsPages/DetailVehicle';
import DetailRenters from '../pages/presentation/buttonsPages/rentersButtonPages/DetailRenters';
import AddRenter from '../pages/presentation/buttonsPages/rentersButtonPages/AddRenter';
import EditRenter from '../pages/presentation/buttonsPages/rentersButtonPages/EditRenter';
import DetailHoldMoke from '../pages/presentation/buttonsPages/DetailHoldMoke';
import EditHoldMoke from '../pages/presentation/buttonsPages/EditHoldMoke';

// Rates 
import ChangeRatesBtn from '../pages/presentation/buttonsPages/ratesButtonPages/ChangeRatesBtn';
import EditRates from '../pages/presentation/buttonsPages/ratesButtonPages/EditRates'
import EditRatesByPerHour from '../pages/presentation/buttonsPages/ratesButtonPages/EditRatesByPerHour'
import DetailRates from '../pages/presentation/buttonsPages/ratesButtonPages/DetailRates'

// Revenue
import DetailRevenue from '../pages/presentation/buttonsPages/revenueButtonPages/DetailRevenue'

// Reservation
import DetailReservation from '../pages/presentation/buttonsPages/DetailReservation'
import UPDATERESERVATION from '../pages/presentation/buttonsPages/updateReservation/UpdateReservation'

const LANDING = {
  DASHBOARD: lazy(() => import('../pages/presentation/single-pages/Dashboard')),
};
const SINGLE = {
  VEHICLES: lazy(() => import('../pages/presentation/single-pages/Vehicles')),
  PARTNERS: lazy(() => import('../pages/presentation/single-pages/Partners')),
  VEHICLESBYPARTNERS: lazy(() => import('../pages/presentation/single-pages/VehiclesByPartner')),
  RESIDENTS_INFORMATION: lazy(() => import('../pages/presentation/single-pages/RenterInformation')),
  REVENUE: lazy(() => import('../pages/presentation/single-pages/Revenue')),
  RESERVATION: lazy(() => import('../pages/presentation/single-pages/Reservation')),
  RATES: lazy(() => import('../pages/presentation/single-pages/Rates')),
  BOOK_MOKE: lazy(() => import('../pages/presentation/single-pages/BookMoke')),
  HOLD_MOKE: lazy(() => import('../pages/presentation/single-pages/HoldMokeDashboard')),
  ADD_HOLD_MOKE: lazy(() => import('../pages/presentation/single-pages/HoldMoke')),
  CHANGE_RATES: lazy(() => import('../pages/presentation/single-pages/ChangeRates')),
};

// const EDIT = {
// 	BOXED: lazy(() => import('../pages/presentation/demo-pages/EditBoxedPage')),
// 	FLUID: lazy(() => import('../pages/presentation/demo-pages/EditFluidPage')),
// 	WIZARD: lazy(() => import('../pages/presentation/demo-pages/EditWizardPage')),
// 	IN_CANVAS: lazy(() => import('../pages/presentation/demo-pages/EditInCanvasPage')),
// 	IN_MODAL: lazy(() => import('../pages/presentation/demo-pages/EditInModalPage')),
// };
// const PRICING = {
// 	PRICING_TABLE: lazy(() => import('../pages/presentation/pricing/PricingTablePage')),
// };

// const AUTH = {
// 	PAGE_404: lazy(() => import('../pages/presentation/auth/Page404')),
// };
const APP = {
  // 	PROJECT_MANAGEMENT: {
  // 		PROJECTS_LIST: lazy(() =>
  // 			import('../pages/presentation/project-management/ProjectManagementsList'),
  // 		),
  // 		PROJECT: lazy(() =>
  // 			import('../pages/presentation/project-management/ProjectManagementsProject'),
  // 		),
  // 	},
  // 	KNOWLEDGE: {
  // 		GRID: lazy(() => import('../pages/presentation/knowledge/KnowledgeGridPage')),
  // 		VIEW: lazy(() => import('../pages/presentation/knowledge/KnowledgeViewPage')),
  // 	},
  // 	SALES: {
  // 		TRANSACTIONS: lazy(() => import('../pages/presentation/sales/TransActionsPage')),
  // 		PRODUCTS: lazy(() => import('../pages/presentation/sales/SalesListPage')),
  // 		PRODUCTS_GRID: lazy(() => import('../pages/presentation/sales/ProductsGridPage')),
  // 		PRODUCTS_VIEW: lazy(() => import('../pages/presentation/sales/ProductViewPage')),
  // 	},

  // 	CRM: {
  // 		CRM_DASHBOARD: lazy(() => import('../pages/presentation/crm/CrmDashboard')),
  // 		CUSTOMERS: lazy(() => import('../pages/presentation/crm/CustomersList')),
  // 		CUSTOMER: lazy(() => import('../pages/presentation/crm/Customer')),
  // 		SALES: lazy(() => import('../pages/presentation/crm/Sales')),
  // 		INVOICE: lazy(() => import('../pages/presentation/crm/Invoice')),
  // 	},
  // 	CHAT: {
  // 		WITH_LIST: lazy(() => import('../pages/presentation/chat/WithListChatPage')),
  // 		ONLY_LIST: lazy(() => import('../pages/presentation/chat/OnlyListChatPage')),
  // 	},
};
const PAGE_LAYOUTS = {
  HEADER_SUBHEADER: lazy(() => import('../pages/presentation/page-layouts/HeaderAndSubheader')),
  HEADER: lazy(() => import('../pages/presentation/page-layouts/OnlyHeader')),
  SUBHEADER: lazy(() => import('../pages/presentation/page-layouts/OnlySubheader')),
  CONTENT: lazy(() => import('../pages/presentation/page-layouts/OnlyContent')),
  BLANK: lazy(() => import('../pages/presentation/page-layouts/Blank')),
  ASIDE: lazy(() => import('../pages/presentation/aside-types/DefaultAsidePage')),
  MINIMIZE_ASIDE: lazy(() => import('../pages/presentation/aside-types/MinimizeAsidePage')),
};

const CONTENT = {
  CONTENTS: lazy(() => import('../pages/documentation/content/ContentListPage')),
  TYPOGRAPHY: lazy(() => import('../pages/documentation/content/TypographyPage')),
  TABLES: lazy(() => import('../pages/documentation/content/TablesPage')),
  FIGURES: lazy(() => import('../pages/documentation/content/FiguresPage')),
};
const FORMS_PAGE = {
  FORMS: lazy(() => import('../pages/documentation/forms/FormsListPage')),
  FORM_GROUP: lazy(() => import('../pages/documentation/forms/FormGroupPage')),
  FORM_CONTROLS: lazy(() => import('../pages/documentation/forms/FormControlsPage')),
  SELECT: lazy(() => import('../pages/documentation/forms/SelectPage')),
  CHECKS_AND_RADIO: lazy(() => import('../pages/documentation/forms/ChecksAndRadioPage')),
  RANGE: lazy(() => import('../pages/documentation/forms/RangePage')),
  INPUT_GROUP: lazy(() => import('../pages/documentation/forms/InputGroupPage')),
};
const COMPONENTS_PAGE = {
  COMPONENTS: lazy(() => import('../pages/documentation/components/ComponentsListPage')),
  BUTTON: lazy(() => import('../pages/documentation/components/ButtonPage')),
  BUTTON_GROUP: lazy(() => import('../pages/documentation/components/ButtonGroupPage')),
  CARD: lazy(() => import('../pages/documentation/components/CardPage')),
  CAROUSEL: lazy(() => import('../pages/documentation/components/CarouselPage')),
  COLLAPSE: lazy(() => import('../pages/documentation/components/CollapsePage')),
  DROPDOWN: lazy(() => import('../pages/documentation/components/DropdownsPage')),
  LIST_GROUP: lazy(() => import('../pages/documentation/components/ListGroupPage')),
  MODAL: lazy(() => import('../pages/documentation/components/ModalPage')),
  NAVS_TABS: lazy(() => import('../pages/documentation/components/NavsTabsPage')),
  OFF_CANVAS: lazy(() => import('../pages/documentation/components/OffCanvasPage')),
  PAGINATION: lazy(() => import('../pages/documentation/components/PaginationPage')),
  POPOVERS: lazy(() => import('../pages/documentation/components/PopoversPage')),
};

const EXTRA = {
  HOOKS: lazy(() => import('../pages/documentation/extras/HooksPage')),
};


const presentation = [
  /**
   * Landing
   */
  {
    path: dashboardMenu.dashboard.path,
    element: <LANDING.DASHBOARD />,
    exact: true,
  },
  {
    path: dashboardMenu.vehicleInventory.path,
    element: <SINGLE.VEHICLES />,
    exact: true,
  },
  {
    path: dashboardMenu.Renter.path,
    element: <SINGLE.RESIDENTS_INFORMATION />,
    exact: true,
  },
  // {
  // 	path: dashboardMenu.summary.path,
  // 	element: <LANDING.SUMMARY />,
  // 	exact: true,
  // },

  /** ************************************************** */

  /**
   * Pages
   */

  /**
   * Single Pages
   */
  {
    path: 'vehicles',
    element: <SINGLE.VEHICLES />,
    exact: true,
  },
  {
    path: 'partners/edit/:id',
    element: <EditPartner />,
    exact: true
  },
  /**
   * List
   */


  /**
   * Grid
   */

  /**
   * Edit
   */
  // {
  // 	path: demoPages.editPages.subMenu.editBoxed.path,
  // 	element: <EDIT.BOXED />,
  // 	exact: true,
  // },
  // {
  // 	path: demoPages.editPages.subMenu.editFluid.path,
  // 	element: <EDIT.FLUID />,
  // 	exact: true,
  // },
  // {
  // 	path: demoPages.editPages.subMenu.editWizard.path,
  // 	element: <EDIT.WIZARD />,
  // 	exact: true,
  // },
  // {
  // 	path: demoPages.editPages.subMenu.editInCanvas.path,
  // 	element: <EDIT.IN_CANVAS />,
  // 	exact: true,
  // },
  // {
  // 	path: demoPages.editPages.subMenu.editInModal.path,
  // 	element: <EDIT.IN_MODAL />,
  // 	exact: true,
  // },

  // {
  // 	path: demoPages.pricingTable.path,
  // 	element: <PRICING.PRICING_TABLE />,
  // 	exact: true,
  // },

  /**
   * END - Pages
   */

  /**
   * Auth Page
   */
  // {
  // 	path: demoPages.page404.path,
  // 	element: <AUTH.PAGE_404 />,
  // 	exact: true,
  // },
  {
    path: dashboardMenu.rates.path,
    element: <SINGLE.RATES />,
    exact: true,
  },
  {
    path: 'auth-pages/sign-up',
    element: <Login isSignUp />,
    exact: true,
  },

  /**
   * BUTTON PAGES
   */
  {
    path: 'partners',
    element: <SINGLE.PARTNERS />,
    exact: true,
  },

  {
    path: 'vehicles/create',
    element: <AddVehicle />,
    exact: true
  },
  {
    path: 'partners/create',
    element: <AddPartner />,
    exact: true
  },
  {
    path: `partners/detail/:id`,
    element: <DetailPartner />,
    exact: true
  },
  {
    path: 'associates/mokes',
    element: <SINGLE.VEHICLESBYPARTNERS />,
    exact: true,
  },
  {
    path: 'vehicles/edit/:id',
    element: <EditVehicle />,
    exact: true
  },
  {
    path: 'vehicles/detail/:id',
    element: <DetailVehicle />,
    exact: true
  },
  {
    path: `${dashboardMenu.Renter.path}/detail/:id`,
    element: <DetailRenters />,
    exact: true
  },
  {
    path: `${dashboardMenu.Renter.path}/edit/:id`,
    element: <EditRenter />,
    exact: true
  },
  {
    path: `${dashboardMenu.Renter.path}/create`,
    element: <AddRenter />,
    exact: true
  },
  {
    path: 'revenue',
    element: <SINGLE.REVENUE />,
    exact: true
  },
  {
    path: 'reservation',
    element: <SINGLE.RESERVATION />,
    exact: true
  },
  {
    path: 'reservation/update/:id',
    element: <UPDATERESERVATION />,
    exact: true
  },
  {
    path: 'reservation/detail/:id',
    element: <DetailReservation />,
    exact: true
  },
  {
    path: 'rates',
    element: <SINGLE.RATES />,
    exact: true
  },
  {
    path: 'rates/change_price',
    element: <ChangeRatesBtn />,
    exact: true
  },
  {
    path: 'change_price/edit/:id/:index',
    element: <EditRates />,
    exact: true
  },
  {
    path: 'change_price/edit/per_hour/:id/:index',
    element: <EditRatesByPerHour />,
    exact: true
  },
  {
    path: 'change_price/detail/:id',
    element: <DetailRates />,
    exact: true
  },
  {
    path: 'revenue/detail/:id',
    element: <DetailRevenue />,
    exact: true
  },
  {
    path: 'book_moke',
    element: <SINGLE.BOOK_MOKE />,
    exact: true
  }, {
    path: 'hold_moke',
    element: <SINGLE.HOLD_MOKE />,
    exact: true
  },
  {
    path: 'hold_moke/add',
    element: <SINGLE.ADD_HOLD_MOKE />,
    exact: true
  },
  {
    path: 'change_price',
    element: <SINGLE.CHANGE_RATES />,
    exact: true
  },
  {
    path: `hold_moke/detail/:id`,
    element: <DetailHoldMoke />,
    exact: true
  },
  {
    path: `hold_moke/edit/:id`,
    element: <EditHoldMoke />,
    exact: true
  },

  /**
   * App
   */

  /**
   * App > Project Management
   */
  // {
  // 	path: demoPages.projectManagement.subMenu.list.path,
  // 	element: <APP.PROJECT_MANAGEMENT.PROJECTS_LIST />,
  // 	exact: true,
  // },
  // {
  // 	path: `${demoPages.projectManagement.subMenu.itemID.path}/:id`,
  // 	element: <APP.PROJECT_MANAGEMENT.PROJECT />,
  // 	exact: true,
  // },

  /**
   * App > Knowledge
   */
  // {
  // 	path: demoPages.knowledge.subMenu.grid.path,
  // 	element: <APP.KNOWLEDGE.GRID />,
  // 	exact: true,
  // },
  // {
  // 	path: `${demoPages.knowledge.subMenu.itemID.path}/:id`,
  // 	element: <APP.KNOWLEDGE.VIEW />,
  // 	exact: true,
  // },

  /**
   * App > Sales
   */
  // {
  // 	path: demoPages.sales.subMenu.transactions.path,
  // 	element: <APP.SALES.TRANSACTIONS />,
  // 	exact: true,
  // },
  // {
  // 	path: demoPages.sales.subMenu.salesList.path,
  // 	element: <APP.SALES.PRODUCTS />,
  // 	exact: true,
  // },
  // {
  // 	path: demoPages.sales.subMenu.productsGrid.path,
  // 	element: <APP.SALES.PRODUCTS_GRID />,
  // 	exact: true,
  // },
  // {
  // 	path: `${demoPages.sales.subMenu.productID.path}/:id`,
  // 	element: <APP.SALES.PRODUCTS_VIEW />,
  // 	exact: true,
  // },

  /**
   * App > Appointment
   */

  // {
  // 	path: demoPages.appointment.subMenu.employeeList.path,
  // 	element: <APP.APPOINTMENT.EMPLOYEE_LIST />,
  // 	exact: true,
  // },
  // {
  // 	path: `${demoPages.appointment.subMenu.employeeID.path}/:id`,
  // 	element: <APP.APPOINTMENT.EMPLOYEE_VIEW />,
  // 	exact: true,
  // },
  // {
  // 	path: demoPages.appointment.subMenu.appointmentList.path,
  // 	element: <APP.APPOINTMENT.APPOINTMENT_LIST />,
  // 	exact: true,
  // },

  /**
   * App > CRM
   */
  // {
  // 	path: demoPages.crm.subMenu.dashboard.path,
  // 	element: <APP.CRM.CRM_DASHBOARD />,
  // 	exact: true,
  // },
  // {
  // 	path: demoPages.crm.subMenu.customersList.path,
  // 	element: <APP.CRM.CUSTOMERS />,
  // 	exact: true,
  // },
  // {
  // 	path: `${demoPages.crm.subMenu.customerID.path}/:id`,
  // 	element: <APP.CRM.CUSTOMER />,
  // 	exact: true,
  // },

  /**
   * App > Chat
   */
  // {
  // 	path: demoPages.chat.subMenu.withListChat.path,
  // 	element: <APP.CHAT.WITH_LIST />,
  // 	exact: true,
  // },
  // {
  // 	path: demoPages.chat.subMenu.onlyListChat.path,
  // 	element: <APP.CHAT.ONLY_LIST />,
  // 	exact: true,
  // },

  /**
   * END - App
   */

  /** ************************************************** */

  /**
   * Page Layout Types
   */
  // {
  // 	path: layoutMenu.blank.path,
  // 	element: <PAGE_LAYOUTS.BLANK />,
  // 	exact: true,
  // },
  {
    path: "page-layouts/header-and-subheader",
    element: <PAGE_LAYOUTS.HEADER_SUBHEADER />,
    exact: true,
  },
  {
    path: 'page-layouts/only-header',
    element: <PAGE_LAYOUTS.HEADER />,
    exact: true,
  },
  {
    path: 'page-layouts/only-subheader',
    element: <PAGE_LAYOUTS.SUBHEADER />,
    exact: true,
  },
  {
    path: 'page-layouts/only-content',
    element: <PAGE_LAYOUTS.CONTENT />,
    exact: true,
  },
  {
    path: 'aside-types/default-aside',
    element: <PAGE_LAYOUTS.ASIDE />,
    exact: true,
  },
  {
    path: 'aside-types/minimize-aside',
    element: <PAGE_LAYOUTS.MINIMIZE_ASIDE />,
    exact: true,
  },
];

const partnerDashboard = [
  {
    path: 'reservation',
    element: <SINGLE.RESERVATION />,
    exact: true
  },
  {
    path: 'revenue',
    element: <SINGLE.REVENUE />,
    exact: true
  },
]
const documentation = [
  /**
   * Bootstrap
   */

  /**
   * Content
   */
  {
    path: componentsMenu.content.path,
    element: <CONTENT.CONTENTS />,
    exact: true,
  },
  {
    path: componentsMenu.content.subMenu.typography.path,
    element: <CONTENT.TYPOGRAPHY />,
    exact: true,
  },
  {
    path: componentsMenu.content.subMenu.figures.path,
    element: <CONTENT.FIGURES />,
    exact: true,
  },

  /**
   * Forms
   */
  {
    path: componentsMenu.forms.path,
    element: <FORMS_PAGE.FORMS />,
    exact: true,
  },
  {
    path: componentsMenu.forms.subMenu.formGroup.path,
    element: <FORMS_PAGE.FORM_GROUP />,
    exact: true,
  },
  {
    path: componentsMenu.forms.subMenu.formControl.path,
    element: <FORMS_PAGE.FORM_CONTROLS />,
    exact: true,
  },
  {
    path: componentsMenu.forms.subMenu.select.path,
    element: <FORMS_PAGE.SELECT />,
    exact: true,
  },
  {
    path: componentsMenu.forms.subMenu.checksAndRadio.path,
    element: <FORMS_PAGE.CHECKS_AND_RADIO />,
    exact: true,
  },
  {
    path: componentsMenu.forms.subMenu.range.path,
    element: <FORMS_PAGE.RANGE />,
    exact: true,
  },
  {
    path: componentsMenu.forms.subMenu.inputGroup.path,
    element: <FORMS_PAGE.INPUT_GROUP />,
    exact: true,
  },

  /**
   * Components
   */
  {
    path: componentsMenu.components.path,
    element: <COMPONENTS_PAGE.COMPONENTS />,
    exact: true,
  },
  {
    path: componentsMenu.components.subMenu.carousel.path,
    element: <COMPONENTS_PAGE.CAROUSEL />,
    exact: true,
  },
  {
    path: componentsMenu.components.subMenu.listGroup.path,
    element: <COMPONENTS_PAGE.LIST_GROUP />,
    exact: true,
  },
  {
    path: componentsMenu.components.subMenu.collapse.path,
    element: <COMPONENTS_PAGE.COLLAPSE />,
    exact: true,
  },
  {
    path: componentsMenu.components.subMenu.pagination.path,
    element: <COMPONENTS_PAGE.PAGINATION />,
    exact: true,
  },

  {
    path: componentsMenu.components.subMenu.card.path,
    element: <COMPONENTS_PAGE.CARD />,
    exact: true,
  },
  {
    path: componentsMenu.components.subMenu.button.path,
    element: <COMPONENTS_PAGE.BUTTON />,
    exact: true,
  },
  {
    path: componentsMenu.components.subMenu.buttonGroup.path,
    element: <COMPONENTS_PAGE.BUTTON_GROUP />,
    exact: true,
  },

  {
    path: componentsMenu.components.subMenu.popovers.path,
    element: <COMPONENTS_PAGE.POPOVERS />,
    exact: true,
  },
  {
    path: componentsMenu.components.subMenu.dropdowns.path,
    element: <COMPONENTS_PAGE.DROPDOWN />,
    exact: true,
  },

  {
    path: componentsMenu.components.subMenu.modal.path,
    element: <COMPONENTS_PAGE.MODAL />,
    exact: true,
  },
  {
    path: componentsMenu.components.subMenu.navsTabs.path,
    element: <COMPONENTS_PAGE.NAVS_TABS />,
    exact: true,
  },
  {
    path: componentsMenu.components.subMenu.offcanvas.path,
    element: <COMPONENTS_PAGE.OFF_CANVAS />,
    exact: true,
  },
  {
    path: componentsMenu.components.subMenu.table.path,
    element: <COMPONENTS_PAGE.TABLE />,
    exact: true,
  },

  /**
   * Utilities
   */


  /**
   * Extra
   */

  /**
   * Icons
   */


  /**
   * Charts
   */

  {
    path: componentsMenu.hooks.path,
    element: <EXTRA.HOOKS />,
    exact: true,
  },
];

const contents = [...presentation, ...documentation];
export const partnerContents = [...partnerDashboard];

export default contents;
