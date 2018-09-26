import { APP } from './constants';

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

export { connectApp, connectAppSuccess, connectAppFailure };
