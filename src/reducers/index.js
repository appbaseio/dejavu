import { combineReducers } from 'redux';

import app from './app';
import mappings from './mappings';
import cell from './cell';

const rootReducer = combineReducers({
	app,
	mappings,
	cell,
});

export default rootReducer;
