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
});

const fetchMappingsFailure = () => ({
	type: MAPPINGS.MAPPINGS_FETCH_FAILURE,
});

const addMappingRequest = (indexName, typeName, field, mapping) => ({
	type: MAPPINGS.ADD_MAPPING_REQUEST,
	field,
	mapping,
	indexName,
	typeName,
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

export {
	fetchMappings,
	fetchMappingsSuccess,
	fetchMappingsFailure,
	addMappingRequest,
	addMappingSuccess,
	addMappingFailure,
	setVisibleColumns,
};
