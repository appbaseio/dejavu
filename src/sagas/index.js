import { all } from 'redux-saga/effects';

import app from './app';
import mappings from './mappings';
import cell from './cell';

export default function* rootSaga() {
	yield all([app(), mappings(), cell()]);
}
