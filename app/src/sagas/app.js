import { put, call, takeEvery } from 'redux-saga/effects';

import { APP } from '../actions/constants';
import { testConnection } from '../apis';
import {
	connectAppSuccess,
	connectAppFailure,
	setError,
	clearError,
} from '../actions';

function* handleConnectApp({ appname, url }) {
	try {
		yield put(clearError());
		yield call(testConnection, appname, url);
		yield put(connectAppSuccess(appname, url));
	} catch (error) {
		yield put(connectAppFailure());
		yield put(
			setError({
				message: error.message,
				description: error.description,
			}),
		);
	}
}

export default function* watchConnectApp() {
	yield takeEvery(APP.CONNECT_REQUEST, handleConnectApp);
}
