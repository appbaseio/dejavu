import { ERROR } from '../actions/constants';

const error = (state = null, action) => {
	switch (action.type) {
		case ERROR.SET_ERROR:
			return action.error;
		case ERROR.CLEAR_ERROR:
			return null;
		default:
			return state;
	}
};

const getError = state => state.error;

export { getError };

export default error;
