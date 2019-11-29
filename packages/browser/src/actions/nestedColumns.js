import { NESTED_COLUMNS } from './constants';

const setIsShwoingNestedColumn = isShowingNestedColumns => ({
	type: NESTED_COLUMNS.SET_IS_SHOWING_NESTED_COLUMNS,
	isShowingNestedColumns,
});

export default setIsShwoingNestedColumn;
