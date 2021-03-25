/**
 * Admin reducer
 */
import { GET_ABOUT, SAVE_ABOUT } from '../actions/types';

const initState = {
	about: {
		heading: '',
		subHeading: '',
		body: '',
		msg: ''
	}
};

/* eslint import/no-anonymous-default-export: [2, {"allowAnonymousFunction": true}] */
export default function(state = initState, action) {
	switch (action.type) {
		case SAVE_ABOUT:
		case GET_ABOUT:
			return {
				...state,
				about: {
					...action.payload
				}
			};
		default:
			return state;
	}
}
