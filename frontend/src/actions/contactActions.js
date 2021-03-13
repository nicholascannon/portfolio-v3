/**
 * Contact Page actions
 */
import { CONTACT_SENT, NEW_ERROR, CONTACT_SENDING, CONTACT_ERROR } from './types';
import axios from 'axios';
import { API } from './globals';

export const sendContact = (name, email, msg) => dispatch => {
	dispatch({ type: CONTACT_SENDING });
	axios
		.post(
			API + '/contact/',
			{ name, email, msg },
			{ headers: { 'Content-Type': 'application/json' } }
		)
		.then(() => dispatch({ type: CONTACT_SENT }))
		.catch(err => {
			dispatch({
				type: NEW_ERROR,
				payload: { msg: err.response.data.msg, code: err.response.code, id: CONTACT_SENT }
			});
			dispatch({ type: CONTACT_ERROR });
		});
};
