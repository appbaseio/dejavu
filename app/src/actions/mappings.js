import { MAPPINGS } from './constants';

const fetchMappings = () => ({
	type: MAPPINGS.MAPPINGS_FETCH_REQUEST,
});

const fetchMappingsSuccess = (
	data,
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
	termsAggregationColumns,
	sortableColumns,
	shouldShowNestedSwitch,
	searchableColumnsWeights,
	nestedSearchableColumnsWeights,
) => ({
	type: MAPPINGS.MAPPINGS_FETCH_SUCCESS,
	data,
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
	termsAggregationColumns,
	sortableColumns,
	shouldShowNestedSwitch,
	searchableColumnsWeights,
	nestedSearchableColumnsWeights,
});

const fetchMappingsFailure = () => ({
	type: MAPPINGS.MAPPINGS_FETCH_FAILURE,
});

const addMappingRequest = (indexName, typeName, field, mapping, version) => ({
	type: MAPPINGS.ADD_MAPPING_REQUEST,
	field,
	mapping,
	indexName,
	typeName,
	version,
});

const addMappingSuccess = () => ({
	type: MAPPINGS.ADD_MAPPING_SUCCESS,
});

const addMappingFailure = () => ({
	type: MAPPINGS.ADD_MAPPING_FAILURE,
});

const setVisibleColumns = visibleColumns => ({
	type: MAPPINGS.SET_VISIBLE_COLUMNS,
	visibleColumns,
});

const setNestedVisibleColumns = nestedVisibleColumns => ({
	type: MAPPINGS.SET_NESTED_VISIBLE_COLUMNS,
	nestedVisibleColumns,
});

const setArrayFields = (
	nestedColumns,
	nestedVisibleColumns,
	nestedMappings,
	appName,
	typePropertyMapping,
) => ({
	type: MAPPINGS.SET_ARRAY_FIELDS,
	nestedColumns,
	nestedVisibleColumns,
	nestedMappings,
	appName,
	typePropertyMapping,
});

export {
	fetchMappings,
	fetchMappingsSuccess,
	fetchMappingsFailure,
	addMappingRequest,
	addMappingSuccess,
	addMappingFailure,
	setVisibleColumns,
	setNestedVisibleColumns,
	setArrayFields,
};
