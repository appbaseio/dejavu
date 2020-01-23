import { SELECTED_ROWS } from '../actions/constants';

const selectedRows = (state = [], action) => {
	switch (action.type) {
		case SELECTED_ROWS.SET_SELECTED_ROWS:
			return action.selectedRows;
		default:
			return state;
	}
};

const getSelectedRows = state => state.selectedRows;

export { getSelectedRows };

export default selectedRows;
