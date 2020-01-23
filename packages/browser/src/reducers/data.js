import { DATA, MAPPINGS } from '../actions/constants';

const initialState = {
	reactiveListKey: 0, // to remount ReactiveList and get fresh data
	isLoading: false,
};

// a single state for data addition in the app currently, might need separation of concern later
const data = (state = initialState, action) => {
	const { type } = action;
	const { reactiveListKey } = state;
	switch (type) {
		case DATA.ADD_DATA_REQUEST:
		case MAPPINGS.ADD_MAPPING_REQUEST:
			return {
				...state,
				isLoading: true,
			};
		case DATA.ADD_DATA_SUCCESS:
			return {
				...state,
				isLoading: false,
			};
		case MAPPINGS.ADD_MAPPING_SUCCESS:
			return {
				...state,
				isLoading: false,
			};
		case DATA.ADD_DATA_FAILURE:
		case MAPPINGS.ADD_MAPPING_FAILURE:
			return {
				...state,
				isLoading: false,
			};
		case DATA.UPDATE_REACTIVE_LIST:
			return {
				...state,
				reactiveListKey: reactiveListKey + 1,
			};
		default:
			return state;
	}
};

// selectors
const getReactiveListKey = state => state.data.reactiveListKey;
const getIsLoading = state => state.data.isLoading;

export { getReactiveListKey, getIsLoading };

export default data;
