import { combineReducers } from 'redux';

import app from './app';
import mappings from './mappings';
import cell from './cell';
import data from './data';

const rootReducer = combineReducers({
	app,
	mappings,
	cell,
	data,
});

export default rootReducer;
