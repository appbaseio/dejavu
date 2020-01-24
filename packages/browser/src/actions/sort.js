import { SORT } from './constants';

export const setSort = (order, field) => ({
	type: SORT.SET_SORT,
	order,
	field,
});

export const resetSort = () => ({
	type: SORT.RESET_SORT,
});
