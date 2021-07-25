import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import store from './store';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import ReactGA from 'react-ga';

import App from './App';

import './index.css';

ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID, {
	debug: process.env.NODE_ENV === 'development'
});

const history = createBrowserHistory();
history.listen(loc => {
	ReactGA.set({ page: loc.pathname });
	ReactGA.pageview(loc.pathname);
});

ReactDOM.render(
	<Provider store={store}>
		<Router history={history}>
			<App />
		</Router>
	</Provider>,
	document.getElementById('App')
);
serviceWorker.unregister();
