import { MAPPINGS } from '../actions/constants';

const initialState = {
	data: null,
	isLoading: false,
	error: null,
	indexes: [],
	types: [],
	indexTypeMap: {},
	columns: [],
	visibleColumns: [],
	searchableColumns: [],
};

const mappings = (state = initialState, action) => {
	const {
		data,
		type,
		error,
		indexes,
		types,
		indexTypeMap,
		columns,
		visibleColumns,
		searchableColumns,
	} = action;
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
				indexTypeMap,
				isLoading: false,
				columns,
				visibleColumns,
				searchableColumns,
			};
		case MAPPINGS.MAPPINGS_FETCH_FAILURE:
			return {
				...state,
				error,
				isLoading: false,
			};
		case MAPPINGS.SET_VISIBLE_COLUMNS:
			return {
				...state,
				visibleColumns,
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
const getIndexTypeMap = state => state.mappings.indexTypeMap;
const getColumns = state => state.mappings.columns;
const getVisibleColumns = state => state.mappings.visibleColumns;
const getSearchableColumns = state => state.mappings.searchableColumns;

export {
	getMappings,
	getIsLoading,
	getError,
	getIndexes,
	getTypes,
	getIndexTypeMap,
	getColumns,
	getVisibleColumns,
	getSearchableColumns,
};

export default mappings;
