import { APP, MAPPINGS } from './constants';

const connectApp = (appname, url) => ({
	type: APP.CONNECT_REQUEST,
	appname,
	url,
});

const connectAppSuccess = (appname, url) => ({
	type: APP.CONNECT_SUCCESS,
	appname,
	url,
});

const connectAppFailure = error => ({
	type: APP.CONNECT_FAILURE,
	error,
});

const disconnectApp = () => ({
	type: APP.DISCONNECT,
});

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

export {
	connectApp,
	disconnectApp,
	connectAppSuccess,
	connectAppFailure,
	fetchMappings,
	fetchMappingsSuccess,
	fetchMappingsFailure,
};
