import { ANALYZERS } from './constants';

const setAnalyzers = analyzers => ({
	type: ANALYZERS.SET_ANALYZERS,
	analyzers,
});

export default setAnalyzers;
