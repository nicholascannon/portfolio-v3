/**
 * Admin Actions
 */
import { SAVE_ABOUT, NEW_ERROR } from './types';
import { API } from './globals';
import axios from 'axios';

export const saveAbout = (heading, subHeading, body) => (dispatch, getState) => {
	axios
		.post(
			API + '/about/',
			{ heading, subHeading, body },
			{ headers: { 'Content-Type': 'application/json', Authorization: getState().auth.token } }
		)
		.then(res => dispatch({ type: SAVE_ABOUT, payload: res.data }))
		.catch(err =>
			dispatch({
				type: NEW_ERROR,
				payload: { msg: err.response.data.msg, code: err.response.status, id: SAVE_ABOUT }
			})
		);
};
