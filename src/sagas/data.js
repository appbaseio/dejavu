import { put, call, takeEvery, select } from 'redux-saga/effects';

import { DATA } from '../actions/constants';
import { addData } from '../apis';
import { addDataSuccess, addDataFailure } from '../actions';
import { getUrl } from '../reducers/app';

function* handleAddData({ indexName, typeName, docId, data }) {
	try {
		const url = yield select(getUrl);
		yield call(addData, indexName, typeName, docId, url, data); // not handling response currently
		yield put(addDataSuccess());
	} catch (error) {
		yield put(addDataFailure(error.message));
	}
}

export default function* watchAddDataRequest() {
	yield takeEvery(DATA.ADD_DATA_REQUEST, handleAddData);
}
