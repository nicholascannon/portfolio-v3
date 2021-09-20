import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import store from './store';
import ReactGA from 'react-ga';
import App from './App';

import './index.css';

ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID, {
	debug: process.env.NODE_ENV === 'development'
});

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('App')
);
serviceWorker.unregister();
