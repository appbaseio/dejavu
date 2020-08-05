import { APP } from './constants';

const connectApp = (appname, url, headers) => ({
	type: APP.CONNECT_REQUEST,
	appname,
	url,
	headers,
});

const connectAppSuccess = (appname, url) => ({
	type: APP.CONNECT_SUCCESS,
	appname,
	url,
});

const connectAppFailure = () => ({
	type: APP.CONNECT_FAILURE,
});

const disconnectApp = () => ({
	type: APP.DISCONNECT,
});

const setHeaders = headers => ({
	type: APP.SET_HEADERS,
	headers,
});

const reloadApp = () => ({
	type: APP.RELOAD_APP,
});

export {
	connectApp,
	disconnectApp,
	connectAppSuccess,
	connectAppFailure,
	setHeaders,
	reloadApp,
};
