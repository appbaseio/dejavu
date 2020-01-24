import { NESTED_COLUMNS } from '../actions/constants';

const nestedColumns = (state = false, action) => {
	const { isShowingNestedColumns } = action;
	switch (action.type) {
		case NESTED_COLUMNS.SET_IS_SHOWING_NESTED_COLUMNS:
			return isShowingNestedColumns;
		default:
			return state;
	}
};

const getIsShowingNestedColumns = state => state.nestedColumns;

export { getIsShowingNestedColumns };

export default nestedColumns;
