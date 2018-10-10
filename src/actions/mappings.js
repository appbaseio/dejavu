import { MAPPINGS } from './constants';

const fetchMappings = () => ({
	type: MAPPINGS.MAPPINGS_FETCH_REQUEST,
});

const fetchMappingsSuccess = data => ({
	type: MAPPINGS.MAPPINGS_FETCH_SUCCESS,
	data,
});

const fetchMappingsFailure = error => ({
	type: MAPPINGS.MAPPINGS_FETCH_FAILURE,
	error,
});

const addMappingRequest = (field, mapping) => ({
	type: MAPPINGS.ADD_MAPPING_REQUEST,
	field,
	mapping,
});

const addMappingSuccess = () => ({
	type: MAPPINGS.ADD_MAPPING_SUCCESS,
});

const addMappingFailure = error => ({
	type: MAPPINGS.ADD_MAPPING_FAILURE,
	error,
});

export {
	fetchMappings,
	fetchMappingsSuccess,
	fetchMappingsFailure,
	addMappingRequest,
	addMappingSuccess,
	addMappingFailure,
};
