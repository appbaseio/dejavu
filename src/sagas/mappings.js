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

const INGNORE_META_TYPES = ['~logs', '.percolator', '~percolator', '_default_'];

function* handleFetchMappings() {
	try {
		const appname = yield select(getAppname);
		const url = yield select(getUrl);
		const data = yield call(fetchMappings, appname, url);
		const indexes = Object.keys(data);
		let properties = {};
		const types = [];
		const indexTypeMap = {};

		indexes.forEach(index => {
			Object.keys(data[index].mappings).forEach(type => {
				indexTypeMap[index] = [...(indexTypeMap[index] || []), type];

				if (
					data[index].mappings[type].properties &&
					INGNORE_META_TYPES.indexOf(type) === -1
				) {
					types.push(type);
					properties = {
						...properties,
						...data[index].mappings[type].properties,
					};
				}
			});
		});

		const mappings = {
			[appname]: {
				properties,
			},
		};
		yield put(fetchMappingsSuccess(mappings, indexes, types, indexTypeMap));
	} catch (error) {
		yield put(fetchMappingsFailure(error.message));
	}
}

function* handleAddMapping({ indexName, typeName, field, mapping }) {
	try {
		const url = yield select(getUrl);
		yield call(addMapping, indexName, typeName, url, field, mapping);
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
