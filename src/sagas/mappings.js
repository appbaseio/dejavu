import { put, call, takeLatest, select, all } from 'redux-saga/effects';

import { MAPPINGS } from '../actions/constants';
import { fetchMappings, addMapping } from '../apis';
import {
	fetchMappingsSuccess,
	fetchMappingsFailure,
	setError,
	addMappingSuccess,
	addMappingFailure,
	clearError,
} from '../actions';
import { getAppname, getUrl } from '../reducers/app';
import { isEmptyObject } from '../utils';
import { extractColumns, META_FIELDS } from '../utils/mappings';
import CustomError from '../utils/CustomError';

const INGNORE_META_TYPES = ['~logs', '.percolator', '~percolator', '_default_'];

function* handleFetchMappings() {
	const defaultError = 'Unable to get mappings';
	const defaultErrorDescription = 'Please add mappings';
	try {
		yield put(clearError());
		const appname = yield select(getAppname);
		const url = yield select(getUrl);
		const data = yield call(fetchMappings, appname, url);
		if (!isEmptyObject(data)) {
			const indexes = Object.keys(data);
			let properties = {};
			const types = [];
			const indexTypeMap = {};
			const typePropertyMapping = {};

			indexes.forEach(index => {
				Object.keys(data[index].mappings).forEach(type => {
					if (
						data[index].mappings[type].properties &&
						INGNORE_META_TYPES.indexOf(type) === -1
					) {
						indexTypeMap[index] = [
							...(indexTypeMap[index] || []),
							type,
						];
						types.push(type);

						properties = {
							...properties,
							...data[index].mappings[type].properties,
						};

						typePropertyMapping[index] = {};
						typePropertyMapping[index][type] =
							data[index].mappings[type].properties;
					}
				});
			});

			if (!isEmptyObject(properties)) {
				const mappings = {
					[appname]: {
						properties,
					},
				};

				const allColumns = [
					...META_FIELDS,
					...extractColumns(mappings[appname]),
				];

				let visibleColumns = allColumns.filter(col => col !== '_type');
				if (indexes.length <= 1) {
					visibleColumns = visibleColumns.filter(
						col => col !== '_index',
					);
				}

				const filteredTypes = types.filter(
					type => !INGNORE_META_TYPES.includes(type),
				);

				const searchableColumns = Object.keys(properties).filter(
					property =>
						properties[property].type === 'string' ||
						properties[property].type === 'text',
				);

				yield put(
					fetchMappingsSuccess(
						mappings,
						indexes,
						filteredTypes,
						indexTypeMap,
						allColumns,
						visibleColumns,
						searchableColumns,
						typePropertyMapping,
					),
				);
			} else {
				throw new CustomError(defaultErrorDescription, defaultError);
			}
		} else {
			throw new CustomError(defaultErrorDescription, defaultError);
		}
	} catch (error) {
		yield put(fetchMappingsFailure());
		yield put(setError(error));
	}
}

function* handleAddMapping({ indexName, typeName, field, mapping }) {
	try {
		yield put(clearError());
		const url = yield select(getUrl);
		yield call(addMapping, indexName, typeName, url, field, mapping);
		yield put(addMappingSuccess());
		yield call(handleFetchMappings); // sagas FTW
	} catch (error) {
		yield put(addMappingFailure());
		yield put(setError(error));
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
