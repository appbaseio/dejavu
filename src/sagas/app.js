import { put, call, takeEvery } from 'redux-saga/effects';

import { APP } from '../actions/constants';
import { testConnection } from '../apis';
import { connectAppSuccess, connectAppFailure } from '../actions';

function* handleConnectApp({ appname, url }) {
	try {
		yield call(testConnection, appname, url);
		yield put(connectAppSuccess(appname, url));
	} catch (error) {
		yield put(connectAppFailure(error.message));
	}
}

export default function* watchConnectApp() {
	yield takeEvery(APP.CONNECT_REQUEST, handleConnectApp);
}
