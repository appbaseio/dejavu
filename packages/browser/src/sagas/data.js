import { put, call, takeEvery, select } from 'redux-saga/effects';

import { DATA } from '../actions/constants';
import { addData } from '../apis';
import {
	addDataSuccess,
	addDataFailure,
	setError,
	clearError,
} from '../actions';
import { getUrl } from '../reducers/app';
import { handleFetchMappings } from './mappings';

function* handleAddData({ indexName, typeName, docId, data, tab, version }) {
	try {
		yield put(clearError());
		const url = yield select(getUrl);
		yield call(addData, indexName, typeName, docId, url, data, version);
		if (tab === 'json') {
			yield call(handleFetchMappings);
		}
		yield put(addDataSuccess());
	} catch (error) {
		yield put(addDataFailure());
		yield put(setError(error));
	}
}

export default function* watchAddDataRequest() {
	yield takeEvery(DATA.ADD_DATA_REQUEST, handleAddData);
}
