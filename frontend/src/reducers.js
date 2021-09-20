import { combineReducers } from 'redux';
import { NEW_ERROR, CLEAR_ERROR, GET_BLOB } from './actions/types';

const initErrorState = {
	msg: '',
	id: '',
	code: null
};

const errorReducer = (state = initErrorState, action) => {
	switch (action.type) {
		case NEW_ERROR:
			return {
				...action.payload
			};
		case CLEAR_ERROR:
			return initErrorState;
		default:
			return state;
	}
};

const initBlobState = {
	about: {
		heading: '',
		subHeading: '',
		body: '',
		msg: ''
	},
	projects: []
};

const blobReducer = (state = initBlobState, action) => {
	switch (action.type) {
		case GET_BLOB:
			return {
				...state,
				about: {
					...action.payload.about
				},
				projects: [...action.payload.projects]
			};
		default:
			return state;
	}
};

export default combineReducers({
	error: errorReducer,
	blob: blobReducer
});
