import { APP } from '../actions/constants';

const initialState = {
	appname: null,
	url: null,
	isConnected: false,
	isLoading: false,
	error: null,
};

const app = (state = initialState, action) => {
	const { appname, url, type, error } = action;
	switch (type) {
		case APP.CONNECT_REQUEST:
			return {
				...state,
				isLoading: true,
				error: null,
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
				error,
				isLoading: false,
			};
		case APP.DISCONNECT:
			return initialState;
		case APP.DISMISS_APP_CONNECT_ERROR:
			return {
				...state,
				error: null,
			};
		default:
			return state;
	}
};

// selectors
const getAppname = state => state.app.appname;
const getUrl = state => state.app.url;
const getIsConnected = state => state.app.isConnected;
const getIsLoading = state => state.app.isLoading;
const getError = state => state.app.error;

export { getAppname, getUrl, getIsLoading, getIsConnected, getError };

export default app;
