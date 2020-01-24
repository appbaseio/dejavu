import { VERSION } from './constants';

const setVersion = version => ({
	type: VERSION.SET_VERSION,
	version,
});

export default setVersion;
