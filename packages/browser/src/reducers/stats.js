import { STATS } from '../actions/constants';

const statsReducers = (state = {}, action) => {
	const { stats, type } = action;
	switch (type) {
		case STATS.SET_STATS:
			return stats;
		default:
			return state;
	}
};

const getStats = state => state.stats;

export { getStats };
export default statsReducers;
