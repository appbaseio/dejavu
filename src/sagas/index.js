import { all } from 'redux-saga/effects';

import app from './app';
import mappings from './mappings';
import cell from './cell';
import data from './data';

export default function* rootSaga() {
	yield all([app(), mappings(), cell(), data()]);
}
