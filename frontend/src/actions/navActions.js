/**
 * Nav actions
 */
import { NAV_TOGGLE, NAV_CLOSE } from './types';

export const toggleNav = () => {
	return { type: NAV_TOGGLE };
};

export const closeNav = () => {
	return { type: NAV_CLOSE };
};
