import { combineReducers } from 'redux';

import app from './app';
import mappings from './mappings';
import cell from './cell';
import data from './data';
import mode from './mode';
import error from './error';
import batteriesReducers from '../batteries/modules/reducers';

const rootReducer = combineReducers({
	app,
	mappings,
	cell,
	data,
	mode,
	error,
	...batteriesReducers,
});

export default rootReducer;
