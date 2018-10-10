import { put, call, takeLatest, select, all } from 'redux-saga/effects';

import { MAPPINGS } from '../actions/constants';
import { fetchMappings, addMapping } from '../apis';
import {
	fetchMappingsSuccess,
	fetchMappingsFailure,
	addMappingSuccess,
	addMappingFailure,
} from '../actions';
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

function* handleAddMapping({ field, mapping }) {
	try {
		const appname = yield select(getAppname);
		const url = yield select(getUrl);
		yield call(addMapping, appname, url, field, mapping);
		yield put(addMappingSuccess());
		yield call(handleFetchMappings); // sagas FTW
	} catch (error) {
		yield put(addMappingFailure(error.message));
	}
}

function* watchAddMapping() {
	yield takeLatest(MAPPINGS.ADD_MAPPING_REQUEST, handleAddMapping);
}

function* watchFetchMappings() {
	yield takeLatest(MAPPINGS.MAPPINGS_FETCH_REQUEST, handleFetchMappings);
}

export default function* mappingsWatcher() {
	yield all([watchAddMapping(), watchFetchMappings()]);
}
