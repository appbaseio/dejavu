import { CELL } from './constants';

const setCellActive = (row, column) => ({
	type: CELL.CELL_ACTIVE,
	row,
	column,
});

const setCellHighlight = (row, column) => ({
	type: CELL.CELL_HIGHLIGHT,
	row,
	column,
});

const setCellValueRequest = (id, property, value, index, esType) => ({
	type: CELL.CELL_SETVALUE_REQUEST,
	id,
	property,
	value,
	index,
	esType,
});

const setCellValueSuccess = () => ({ type: CELL.CELL_SETVALUE_SUCCESS }); // update data

const setCellValueFailure = () => ({
	type: CELL.CELL_SETVALUE_FAILURE,
});

export {
	setCellActive,
	setCellHighlight,
	setCellValueRequest,
	setCellValueSuccess,
	setCellValueFailure,
};
