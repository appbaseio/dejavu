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
import {
	extractColumns,
	META_FIELDS,
	getMappingsTree,
} from '../utils/mappings';
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
			let nestedProperties = {};
			const types = [];
			const indexTypeMap = {};
			const typePropertyMapping = {};

			indexes.forEach(index => {
				const typesList = Object.keys(data[index].mappings);

				if (typesList.length) {
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
							nestedProperties = {
								...properties,
								...getMappingsTree(
									data[index].mappings[type].properties,
								),
							};

							typePropertyMapping[index] = {};
							typePropertyMapping[index][type] = getMappingsTree(
								data[index].mappings[type].properties,
							);
						}
					});
				} else {
					types.push('_doc');
					indexTypeMap[index] = ['_doc'];
					typePropertyMapping[index] = {};
					typePropertyMapping[index]._doc = {};
				}
			});

			const mappings = {
				[appname]: {
					properties,
					nestedProperties,
				},
			};

			const allColumns = [
				...META_FIELDS,
				...extractColumns(mappings[appname], 'properties'),
			];

			const allNestedColumns = [
				...META_FIELDS,
				...extractColumns(mappings[appname], 'nestedProperties'),
			];

			let visibleColumns = allColumns.filter(col => col !== '_type');
			if (indexes.length <= 1) {
				visibleColumns = visibleColumns.filter(col => col !== '_index');
			}

			let nestedVisibleColumns = allNestedColumns.filter(
				col => col !== '_type',
			);
			if (indexes.length <= 1) {
				nestedVisibleColumns = nestedVisibleColumns.filter(
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

			const nestedSearchableColumns = Object.keys(
				nestedProperties,
			).filter(
				property =>
					nestedProperties[property].type === 'string' ||
					nestedProperties[property].type === 'text',
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
					nestedVisibleColumns,
					nestedSearchableColumns,
					allNestedColumns,
				),
			);
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
