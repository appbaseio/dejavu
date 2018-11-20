import { combineReducers } from 'redux';

import app from './app';
import mappings from './mappings';
import cell from './cell';
import data from './data';
import mode from './mode';
import error from './error';
import selectedRows from './selectedRows';
import updatingRow from './updatingRow';
import batteriesReducers from '../batteries/modules/reducers';

const rootReducer = combineReducers({
	app,
	mappings,
	cell,
	data,
	mode,
	error,
	selectedRows,
	updatingRow,
	...batteriesReducers,
});

export default rootReducer;
