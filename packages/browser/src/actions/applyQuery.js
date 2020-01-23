import { APPLY_QUERY } from './constants';

const setApplyQuery = applyQuery => ({
	type: APPLY_QUERY.SET_APPLY_QUERY,
	applyQuery,
});

export default setApplyQuery;
