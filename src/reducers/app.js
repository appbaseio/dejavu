import { APP } from '../actions/constants';

const initialState = {
	appname: null,
	url: null,
	isConnected: false,
	isLoading: false,
};

const app = (state = initialState, action) => {
	const { appname, url, type } = action;
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
		case APP.DISCONNECT:
			return initialState;
		default:
			return state;
	}
};

// selectors
const getAppname = state => state.app.appname;
const getUrl = state => state.app.url;
const getIsConnected = state => state.app.isConnected;
const getIsLoading = state => state.app.isLoading;

export { getAppname, getUrl, getIsLoading, getIsConnected };

export default app;
