import { APP } from './constants';

const connectApp = (appname, url) => ({
	type: APP.CONNECT_REQUEST,
	appname,
	url,
});

const setApp = (appname, url) => ({
	type: APP.CONNECT_SUCCESS,
	appname,
	url,
});

export { connectApp, setApp };
