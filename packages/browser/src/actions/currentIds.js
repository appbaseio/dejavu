// action to list current rendered ids
import { CURRENT_IDS } from './constants';

const setCurrentIds = ids => ({
	type: CURRENT_IDS.SET_CURRENT_IDS,
	ids,
});

export default setCurrentIds;
