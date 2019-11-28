import { MODE } from '../actions/constants';
import { MODES } from '../constants';

const mode = (state = MODES.EDIT, action) => {
	switch (action.type) {
		case MODE.SET_MODE:
			return action.mode;
		default:
			return state;
	}
};

const getMode = state => state.mode;

export { getMode };

export default mode;
