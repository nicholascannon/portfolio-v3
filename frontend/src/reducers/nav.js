/**
 * Navbar reducer
 */
import { NAV_TOGGLE, NAV_CLOSE } from '../actions/types';

const initState = {
	isOpen: false
};

export default function(state = initState, action) {
	switch (action.type) {
		case NAV_TOGGLE:
			return {
				...state,
				isOpen: !state.isOpen
			};
		case NAV_CLOSE:
			return {
				...state,
				isOpen: false
			};
		default:
			return state;
	}
}
