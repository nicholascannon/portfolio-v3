import { GET_PROJECTS, NEW_ERROR, GET_ABOUT } from './types';
import axios from 'axios';
import { API } from './globals';

export const getBlob = () => dispatch => {
	axios
		.get(API + '/blob')
		.then(res => {
			dispatch({ type: GET_PROJECTS, payload: res.data.projects });
			dispatch({ type: GET_ABOUT, payload: res.data.about });
		})
		.catch(err => {
			console.error(err);
			dispatch({
				type: NEW_ERROR,
				payload: { msg: err.response?.data.msg, code: err.response.status, id: GET_PROJECTS }
			});
		});
};
