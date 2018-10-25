import { combineReducers } from 'redux';

import app from './app';
import mappings from './mappings';
import cell from './cell';
import data from './data';
import mode from './mode';

const rootReducer = combineReducers({
	app,
	mappings,
	cell,
	data,
	mode,
});

export default rootReducer;
