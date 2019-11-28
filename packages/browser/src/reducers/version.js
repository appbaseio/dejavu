import { VERSION } from '../actions/constants';

const versionReducer = (state = 5, action) => {
	const { version } = action;
	switch (action.type) {
		case VERSION.SET_VERSION:
			return version;
		default:
			return state;
	}
};

const getVersion = state => state.version;

export { getVersion };

export default versionReducer;
