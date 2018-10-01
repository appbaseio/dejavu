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

export { fetchMappings, fetchMappingsSuccess, fetchMappingsFailure };
