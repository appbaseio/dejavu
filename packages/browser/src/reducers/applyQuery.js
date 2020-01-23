import { APPLY_QUERY } from '../actions/constants';

const applyQueryReducer = (state = false, action) => {
	const { applyQuery } = action;
	switch (action.type) {
		case APPLY_QUERY.SET_APPLY_QUERY:
			return applyQuery;
		default:
			return state;
	}
};

const getApplyQuery = state => state.applyQuery;

export { getApplyQuery };

export default applyQueryReducer;
