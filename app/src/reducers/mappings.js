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
	nestedVisibleColumns: [],
	nestedSearchableColumns: [],
	nestedColumns: [],
	termsAggregationColumns: [],
	sortableColumns: [],
	shouldShowNestedSwitch: false,
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
		nestedVisibleColumns,
		nestedSearchableColumns,
		nestedColumns,
		appName,
		termsAggregationColumns,
		sortableColumns,
		shouldShowNestedSwitch,
		searchableColumnsWeights,
		nestedSearchableColumnsWeights,
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
				nestedVisibleColumns,
				nestedSearchableColumns,
				nestedColumns,
				termsAggregationColumns,
				sortableColumns,
				shouldShowNestedSwitch,
				searchableColumnsWeights,
				nestedSearchableColumnsWeights,
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
		case MAPPINGS.SET_NESTED_VISIBLE_COLUMNS:
			return {
				...state,
				nestedVisibleColumns,
			};
		case MAPPINGS.SET_ARRAY_FIELDS:
			return {
				...state,
				nestedColumns,
				nestedVisibleColumns,
				typePropertyMapping,
				data: {
					[appName]: {
						...state.data[appName],
						nestedProperties: {
							...state.data[appName].nestedProperties,
							...action.nestedMappings,
						},
					},
				},
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
const getNestedColumns = state => state.mappings.nestedColumns;
const getNestedVisibleColumns = state => state.mappings.nestedVisibleColumns;
const getNestedSearchableColumns = state =>
	state.mappings.nestedSearchableColumns;
const getTermsAggregationColumns = state =>
	state.mappings.termsAggregationColumns;
const getSortableColumns = state => state.mappings.sortableColumns;
const getShouldShowNestedSwitch = state =>
	state.mappings.shouldShowNestedSwitch;
const getSearchableColumnsWeights = state =>
	state.mappings.searchableColumnsWeights;
const getNesetedSearchableColumnsWeights = state =>
	state.mappings.nestedSearchableColumnsWeights;

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
	getNestedColumns,
	getNestedVisibleColumns,
	getNestedSearchableColumns,
	getTermsAggregationColumns,
	getSortableColumns,
	getShouldShowNestedSwitch,
	getSearchableColumnsWeights,
	getNesetedSearchableColumnsWeights,
};

export default mappings;
