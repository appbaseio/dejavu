import { all } from 'redux-saga/effects';

import app from './app';
import mappings from './mappings';

export default function* rootSaga() {
	yield all([app(), mappings()]);
}
