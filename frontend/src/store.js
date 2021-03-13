/**
 * store.js
 */
import { createStore, compose, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const middleware = [thunk, logger];
const initState = {};

export default createStore(
	rootReducer,
	initState,
	compose(
		applyMiddleware(...middleware),
		window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
	)
);
