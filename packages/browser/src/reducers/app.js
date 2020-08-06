import { APP } from '../actions/constants';

const initialState = {
	appname: null,
	url: null,
	isConnected: false,
	isLoading: false,
	headers: [],
	key: Date.now(),
};

const app = (state = initialState, action) => {
	const { appname, url, type, headers } = action;
	switch (type) {
		case APP.CONNECT_REQUEST:
			return {
				...state,
				isLoading: true,
			};
		case APP.CONNECT_SUCCESS:
			return {
				...state,
				appname,
				url,
				isConnected: true,
				isLoading: false,
			};
		case APP.CONNECT_FAILURE:
			return {
				...state,
				isLoading: false,
			};
		case APP.SET_HEADERS:
			return { ...state, headers };
		case APP.RELOAD_APP:
			return { ...state, key: Date.now() };
		default:
			return state;
	}
};

// selectors
const getAppname = state => state.app.appname;
const getUrl = state => state.app.url;
const getIsConnected = state => state.app.isConnected;
const getIsLoading = state => state.app.isLoading;
const getHeaders = state => state.app.headers;
const getKey = state => state.app.key;

export { getAppname, getUrl, getIsLoading, getIsConnected, getHeaders, getKey };

export default app;
