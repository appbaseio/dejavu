import { QUERY } from '../actions/constants';

const queryReducer = (state = {}, action) => {
	const { query } = action;
	switch (action.type) {
		case QUERY.SET_QUERY:
			return query;
		default:
			return state;
	}
};

const getQuery = state => state.query;

export { getQuery };

export default queryReducer;
