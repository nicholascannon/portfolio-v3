/**
 * Projects reducer
 */
import { SAVE_PROJECT, GET_PROJECTS, EDIT_PROJECT, DELETE_PROJECT } from '../actions/types';

const initState = {
	projects: []
};

export default function(state = initState, action) {
	switch (action.type) {
		case SAVE_PROJECT:
			return {
				...state,
				projects: [...state.projects, action.payload]
			};
		case EDIT_PROJECT:
			// filter the old version of the edited project out of the state
			const projects = state.projects.filter(project => project._id !== action.payload._id);
			return {
				...state,
				projects: [...projects, action.payload]
			};
		case GET_PROJECTS:
			return {
				...state,
				projects: action.payload
			};
		case DELETE_PROJECT:
			return {
				...state,
				projects: state.projects.filter(project => project._id !== action.payload)
			};
		default:
			return state;
	}
}
