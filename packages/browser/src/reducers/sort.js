import { SORT } from '../actions/constants';

const defaultState = {
	order: 'desc',
	field: '_score',
};
const sort = (state = defaultState, action) => {
	const { order, field } = action;
	switch (action.type) {
		case SORT.SET_SORT:
			return {
				...state,
				order,
				field,
			};
		case SORT.RESET_SORT:
			return defaultState;
		default:
			return state;
	}
};

const getSort = state => state.sort;

export { getSort };

export default sort;
