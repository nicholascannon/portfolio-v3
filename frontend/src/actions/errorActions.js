/**
 * Error actions
 */
import { NEW_ERROR, CLEAR_ERROR } from './types';

export const new_error = err => () => {
	return { type: NEW_ERROR, payload: err };
};
export const clear_error = () => {
	return { type: CLEAR_ERROR };
};
