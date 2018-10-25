import { MODE } from './constants';

const setMode = mode => ({
	type: MODE.SET_MODE,
	mode,
});

export default setMode;
