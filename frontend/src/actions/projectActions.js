/**
 * Project Actions
 */
import { SAVE_PROJECT, EDIT_PROJECT, GET_PROJECTS, NEW_ERROR, DELETE_PROJECT } from './types';
import axios from 'axios';
import { API } from './globals';

export const getProjects = () => dispatch => {
	axios
		.get(API + '/projects/')
		.then(res => dispatch({ type: GET_PROJECTS, payload: res.data }))
		.catch(err =>
			dispatch({
				type: NEW_ERROR,
				payload: { msg: err.response.data.msg, code: err.response.status, id: GET_PROJECTS }
			})
		);
};

export const editProject = project => (dispatch, getState) => {
	axios
		.put(API + `/projects/${project.uuid}`, project, {
			headers: { 'Content-Type': 'application/json', Authorization: getState().auth.token }
		})
		.then(res => dispatch({ type: EDIT_PROJECT, payload: res.data }))
		.catch(err =>
			dispatch({
				type: NEW_ERROR,
				payload: { msg: err.response.data.msg, code: err.response.status, id: EDIT_PROJECT }
			})
		);
};

export const saveProject = project => (dispatch, getState) => {
	axios
		.post(API + '/projects/', project, {
			headers: { 'Content-Type': 'application/json', Authorization: getState().auth.token }
		})
		.then(res => dispatch({ type: SAVE_PROJECT, payload: res.data }))
		.catch(err =>
			dispatch({
				type: NEW_ERROR,
				payload: { msg: err.response.data.msg, code: err.response.status, id: SAVE_PROJECT }
			})
		);
};

export const deleteProject = uuid => (dispatch, getState) => {
	axios
		.delete(
			API + `/projects/${uuid}`,
			{},
			{
				headers: { 'Content-Type': 'application/json', Authorization: getState().auth.token }
			}
		)
		.then(res => dispatch({ type: DELETE_PROJECT, payload: uuid }))
		.catch(err =>
			dispatch({
				type: NEW_ERROR,
				payload: { msg: err.response.data.msg, code: err.response.status, id: SAVE_PROJECT }
			})
		);
};
