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
};

const cell = (state = initialState, action) => {
	const { type, row, column } = action;
	switch (type) {
		case CELL.CELL_ACTIVE:
			return {
				...state,
				activeCell: {
					row,
					column,
				},
			};
		case CELL.CELL_HIGHLIGHT:
			return {
				...state,
				highlightCell: { row, column },
			};
		case CELL.CELL_SETVALUE_FAILURE:
			return state;
		default:
			return state;
	}
};

// selectors
const getActiveCell = state => state.cell.activeCell;
const getHighlightCell = state => state.cell.highlightCell;

export { getActiveCell, getHighlightCell };

export default cell;
