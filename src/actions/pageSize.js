import { PAGE_SIZE } from './constants';

const setPageSize = pageSize => ({
	type: PAGE_SIZE.SET_PAGE_SIZE,
	pageSize,
});

export default setPageSize;
