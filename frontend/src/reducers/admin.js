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
