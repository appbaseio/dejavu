import { MAPPINGS } from '../actions/constants';

const initialState = {
	data: null,
	isLoading: false,
	error: null,
	indexes: [],
	types: [],
};

const mappings = (state = initialState, action) => {
	const { data, type, error, indexes, types } = action;
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
				indexes,
				types,
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
const getIndexes = state => state.mappings.indexes;
const getTypes = state => state.mappings.types;

export { getMappings, getIsLoading, getError, getIndexes, getTypes };

export default mappings;
