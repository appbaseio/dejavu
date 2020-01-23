import { UPDATING_ROW } from '../actions/constants';

const updatingRow = (state = null, action) => {
	switch (action.type) {
		case UPDATING_ROW.SET_UPDATING_ROW:
			return action.rowData;
		default:
			return state;
	}
};

const getUpdatingRow = state => state.updatingRow;

export { getUpdatingRow };

export default updatingRow;
