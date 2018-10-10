import { DATA } from '../actions/constants';

const initialState = {
	reactiveListKey: 0, // to remount ReactiveList and get fresh data
	isLoading: false,
	error: null,
};

const data = (state = initialState, action) => {
	const { type, error } = action;
	const { reactiveListKey } = state;
	switch (type) {
		case DATA.ADD_DATA_REQUEST:
			return {
				...state,
				isLoading: true,
				error: null,
			};
		case DATA.ADD_DATA_SUCCESS:
			return {
				reactiveListKey: reactiveListKey + 1,
				isLoading: false,
				error: null,
			};
		case DATA.ADD_DATA_FAILURE:
			return {
				...state,
				isLoading: false,
				error,
			};
		default:
			return state;
	}
};

// selectors
const getReactiveListKey = state => state.data.reactiveListKey;
const getIsLoading = state => state.data.isLoading;
const getError = state => state.data.error;

export { getReactiveListKey, getIsLoading, getError };

export default data;
