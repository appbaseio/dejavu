import { SELECT_ALL } from './constants';

const setSelectAll = selectAll => ({
	type: SELECT_ALL.SET_SELECT_ALL,
	selectAll,
});

export default setSelectAll;
