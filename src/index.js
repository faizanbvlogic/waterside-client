import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/styles.scss';
import App from './App/App';
import reportWebVitals from './reportWebVitals';
import { ThemeContextProvider } from './contexts/themeContext';
import './i18n';
import { Provider } from 'react-redux';
import store from '../src/globalState/store'
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from '../src/globalState/store'


ReactDOM.render(
	<Provider store={store}>
		<PersistGate persistor={persistor}>
			<Router>
				<React.StrictMode>
					<ThemeContextProvider>
						<App />
					</ThemeContextProvider>
				</React.StrictMode>
			</Router>
		</PersistGate>
	</Provider>,
	document.getElementById('root'),
);

reportWebVitals();
