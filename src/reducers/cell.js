import { CELL } from '../actions/constants';

const initialState = {
	activeCell: {
		row: null,
		column: null,
	},
	highlightCell: {
		row: null,
		column: null,
	},
	error: null,
};

const cell = (state = initialState, action) => {
	const { type, row, column, error } = action;
	switch (type) {
		case CELL.CELL_ACTIVE:
			return {
				...state,
				activeCell: {
					row,
					column,
				},
				error: null,
			};
		case CELL.CELL_HIGHLIGHT:
			return {
				...state,
				highlightCell: { row, column },
			};
		case CELL.CELL_SETVALUE_FAILURE:
			return {
				...state,
				error,
			};
		default:
			return state;
	}
};

// selectors
const getActiveCell = state => state.cell.activeCell;
const getHighlightCell = state => state.cell.highlightCell;
const getError = state => state.cell.error;

export { getActiveCell, getHighlightCell, getError };

export default cell;
