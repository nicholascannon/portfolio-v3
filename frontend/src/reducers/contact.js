/**
 * Contact reducer
 */
import { CONTACT_SENT, CONTACT_SENDING, CONTACT_ERROR } from '../actions/types';

const initState = {
	sent: false,
	sending: false
};

export default function(state = initState, action) {
	switch (action.type) {
		case CONTACT_SENDING:
			return {
				...state,
				sending: true
			};
		case CONTACT_ERROR:
			return {
				...state,
				sent: false,
				sending: false
			};
		case CONTACT_SENT:
			return {
				...state,
				sent: true,
				sending: false
			};
		default:
			return state;
	}
}
