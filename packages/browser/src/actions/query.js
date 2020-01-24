import { QUERY } from './constants';

const setQuery = query => ({
	type: QUERY.SET_QUERY,
	query,
});

export default setQuery;
