import { SELECT_ALL } from '../actions/constants';

const selectAllReducer = (state = false, action) => {
	const { selectAll } = action;
	switch (action.type) {
		case SELECT_ALL.SET_SELECT_ALL:
			return selectAll;
		default:
			return state;
	}
};

const getSelectAll = state => state.selectAll;

export { getSelectAll };

export default selectAllReducer;
