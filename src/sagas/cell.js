import { put, call, takeEvery, select } from 'redux-saga/effects';

import { CELL } from '../actions/constants';
import { setCellValue } from '../apis';
import { setCellValueSuccess, setCellValueFailure } from '../actions';
import { getUrl } from '../reducers/app';

function* handleSetValue({ id, property, value, index, esType }) {
	try {
		const url = yield select(getUrl);
		const data = yield call(
			setCellValue,
			index,
			esType,
			url,
			id,
			property,
			value,
		);
		yield put(setCellValueSuccess(data));
	} catch (error) {
		yield put(setCellValueFailure(error.message));
	}
}

export default function* watchSetCellValueRequest() {
	yield takeEvery(CELL.CELL_SETVALUE_REQUEST, handleSetValue);
}
