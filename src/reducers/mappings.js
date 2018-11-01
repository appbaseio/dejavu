import { MAPPINGS } from '../actions/constants';

const initialState = {
	data: null,
	isLoading: false,
	indexes: [],
	types: [],
	indexTypeMap: {},
	columns: [],
	visibleColumns: [],
	searchableColumns: [],
	typePropertyMapping: {},
};

const mappings = (state = initialState, action) => {
	const {
		data,
		type,
		indexes,
		types,
		indexTypeMap,
		columns,
		visibleColumns,
		searchableColumns,
		typePropertyMapping,
	} = action;
	switch (type) {
		case MAPPINGS.MAPPINGS_FETCH_REQUEST:
			return {
				...state,
				isLoading: true,
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
				typePropertyMapping,
			};
		case MAPPINGS.MAPPINGS_FETCH_FAILURE:
			return {
				...state,
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
const getIndexes = state => state.mappings.indexes;
const getTypes = state => state.mappings.types;
const getIndexTypeMap = state => state.mappings.indexTypeMap;
const getColumns = state => state.mappings.columns;
const getVisibleColumns = state => state.mappings.visibleColumns;
const getSearchableColumns = state => state.mappings.searchableColumns;
const getTypePropertyMapping = state => state.mappings.typePropertyMapping;

export {
	getMappings,
	getIsLoading,
	getIndexes,
	getTypes,
	getIndexTypeMap,
	getColumns,
	getVisibleColumns,
	getSearchableColumns,
	getTypePropertyMapping,
};

export default mappings;
