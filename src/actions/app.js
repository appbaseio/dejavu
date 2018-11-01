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

const connectAppFailure = () => ({
	type: APP.CONNECT_FAILURE,
});

const disconnectApp = () => ({
	type: APP.DISCONNECT,
});

export { connectApp, disconnectApp, connectAppSuccess, connectAppFailure };
