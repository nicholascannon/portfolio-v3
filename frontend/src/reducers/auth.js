/**
 * Authentication reducer
 */
import { LOGIN_SUCCESS, LOGIN_FAIL, LOAD_USER, LOAD_FAIL, LOGOUT, LOADING } from '../actions/types';

const initState = {
	token: localStorage.getItem('token'),
	email: '',
	isAuthenticated: false,
	loadingUser: false
};

export default function(state = initState, action) {
	switch (action.type) {
		case LOADING:
			return {
				...state,
				loadingUser: true
			};
		case LOAD_USER:
			return {
				...state,
				email: action.payload.email,
				loadingUser: false,
				isAuthenticated: true
			};
		case LOGIN_SUCCESS:
			localStorage.setItem('token', action.payload.token);
			return {
				...state,
				isAuthenticated: true,
				loadingUser: false,
				...action.payload
			};
		case LOGIN_FAIL:
		case LOAD_FAIL:
		case LOGOUT:
			localStorage.removeItem('token');
			return initState;
		default:
			return state;
	}
}
