import { PAGE_SIZE } from '../actions/constants';

const pagination = (state = 15, action) => {
	const { pageSize } = action;
	switch (action.type) {
		case PAGE_SIZE.SET_PAGE_SIZE:
			return pageSize;
		default:
			return state;
	}
};

const getPageSize = state => state.pageSize;
export { getPageSize };

export default pagination;
