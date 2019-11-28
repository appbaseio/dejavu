import { CURRENT_IDS } from '../actions/constants';

const currentIds = (state = [], action) => {
	switch (action.type) {
		case CURRENT_IDS.SET_CURRENT_IDS:
			return action.ids;
		default:
			return state;
	}
};

const getCurrentIds = state => state.currentIds;

export { getCurrentIds };

export default currentIds;
