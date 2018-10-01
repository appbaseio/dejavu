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

export { setCellActive, setCellHighlight };
