import { MAPPINGS } from '../actions/constants';

const initialState = {
	data: null,
	isLoading: false,
	error: null,
};

const mappings = (state = initialState, action) => {
	const { data, type, error } = action;
	switch (type) {
		case MAPPINGS.MAPPINGS_FETCH_REQUEST:
			return {
				...state,
				isLoading: true,
				error: null,
			};
		case MAPPINGS.MAPPINGS_FETCH_SUCCESS:
			return {
				...state,
				data,
				isLoading: false,
			};
		case MAPPINGS.MAPPINGS_FETCH_FAILURE:
			return {
				...state,
				error,
				isLoading: false,
			};
		default:
			return state;
	}
};

// selectors
const getMappings = state => state.mappings.data;
const getIsLoading = state => state.mappings.isLoading;
const getError = state => state.mappings.error;

export { getMappings, getIsLoading, getError };

export default mappings;
