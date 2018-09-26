import { all } from 'redux-saga/effects';

import app from './app';

export default function* rootSaga() {
	yield all([app()]);
}
