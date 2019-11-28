import { ERROR } from './constants';

export const setError = error => ({
	type: ERROR.SET_ERROR,
	error,
});

export const clearError = () => ({
	type: ERROR.CLEAR_ERROR,
});
