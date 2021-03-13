/**
 * Error reducer
 */
import { NEW_ERROR, CLEAR_ERROR } from '../actions/types';

const initState = {
	msg: '',
	code: null,
	id: ''
};

export default function(state = initState, action) {
	switch (action.type) {
		case NEW_ERROR:
			return {
				...action.payload
			};
		case CLEAR_ERROR:
			return initState;
		default:
			return state;
	}
}
