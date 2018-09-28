import { put, call, takeLatest, select } from 'redux-saga/effects';

import { MAPPINGS } from '../actions/constants';
import { fetchMappings } from '../apis';
import { fetchMappingsSuccess, fetchMappingsFailure } from '../actions';
import { getAppname, getUrl } from '../reducers/app';

function* handleFetchMappings() {
	try {
		const appname = yield select(getAppname);
		const url = yield select(getUrl);
		const data = yield call(fetchMappings, appname, url);
		yield put(fetchMappingsSuccess(data[appname].mappings));
	} catch (error) {
		yield put(fetchMappingsFailure(error.message));
	}
}

export default function* watchFetchMappings() {
	yield takeLatest(MAPPINGS.MAPPINGS_FETCH_REQUEST, handleFetchMappings);
}
