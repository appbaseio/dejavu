import { combineReducers } from 'redux';

import { APP as APP_CONSTANTS } from '../actions/constants';
import app from './app';
import mappings from './mappings';
import cell from './cell';
import data from './data';
import mode from './mode';
import error from './error';
import selectedRows from './selectedRows';
import updatingRow from './updatingRow';
import currentIds from './currentIds';
import sort from './sort';
import pageSize from './pageSize';
import nestedColumns from './nestedColumns';
import version from './version';
import query from './query';
import applyQuery from './applyQuery';
import selectAll from './selectAll';
import stats from './stats';
import analyzers from './analyzers';
import batteriesReducers from '../batteries/modules/reducers';

const appReducer = combineReducers({
	app,
	mappings,
	cell,
	data,
	mode,
	error,
	selectedRows,
	updatingRow,
	currentIds,
	sort,
	pageSize,
	nestedColumns,
	version,
	query,
	applyQuery,
	selectAll,
	stats,
	analyzers,
	...batteriesReducers,
});

const initialState = appReducer({}, {});

const rootReducer = (state, action) => {
	let newState = { ...state };
	if (action.type === APP_CONSTANTS.DISCONNECT) {
		newState = { ...initialState };
	}

	return appReducer(newState, action);
};

export default rootReducer;
