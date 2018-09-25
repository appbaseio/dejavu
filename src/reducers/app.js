import { APP } from '../actions/constants';

const initialState = {
	appname: null,
	url: null,
};

const app = (state = initialState, action) => {
	const { appname, url, type } = action;
	switch (type) {
		case APP.CONNECT_SUCCESS:
			return { appname, url };
		case APP.DISCONNECT:
			return initialState;
		default:
			return state;
	}
};

export default app;
