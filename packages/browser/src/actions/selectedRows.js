import { SELECTED_ROWS } from './constants';

const setSelectedRows = selectedRows => ({
	type: SELECTED_ROWS.SET_SELECTED_ROWS,
	selectedRows,
});

export default setSelectedRows;
