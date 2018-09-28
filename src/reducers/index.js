import { combineReducers } from 'redux';

import app from './app';
import mappings from './mappings';

const rootReducer = combineReducers({
	app,
	mappings,
});

export default rootReducer;
