import { MODE } from '../actions/constants';

const mode = (state = 'view', action) => {
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
