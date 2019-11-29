import { ANALYZERS } from '../actions/constants';

const analyzer = (state = [], action) => {
	switch (action.type) {
		case ANALYZERS.SET_ANALYZERS:
			return action.analyzers;
		default:
			return state;
	}
};

const getAnalyzers = state => state.analyzers;

export { getAnalyzers };

export default analyzer;
