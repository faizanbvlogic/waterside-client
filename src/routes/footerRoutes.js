import React from 'react';
import Footer from '../layout/Footer/Footer';

const footers = [
	{ path: 'page-layouts/blank', element: null, exact: true },
	{ path: 'auth-pages/login', element: null, exact: true },
	{ path: 'auth-pages/sign-up', element: null, exact: true },
	{ path: 'chatbot/renter', element: null, exact: true },
	{ path: 'chatbot', element: null, exact: true },
	{ path: 'chatbot/delivery', element: null, exact: true },
	{ path: 'chatbot/slots', element: null, exact: true },
	{ path: '*', element: <Footer /> },
];

export default footers;
