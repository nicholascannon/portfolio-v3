import axios from 'axios';
import { CLEAR_ERROR, NEW_ERROR, GET_BLOB } from './types';

const API = process.env.NODE_ENV === 'development' ? 'http://localhost:8000/api' : '/api';

export const getBlob = () => dispatch => {
	axios
		.get(API + '/blob')
		.then(res =>
			dispatch({
				type: GET_BLOB,
				payload: { about: res.data.about, projects: res.data.projects }
			})
		)
		.catch(err =>
			dispatch({
				type: NEW_ERROR,
				payload: { msg: err.response?.data.msg, code: err.response?.status, id: GET_BLOB }
			})
		);
};

export const newError = err => () => ({ type: NEW_ERROR, payload: err });

export const clearError = () => ({ type: CLEAR_ERROR });
