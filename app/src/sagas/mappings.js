import { put, call, takeLatest, select, all } from 'redux-saga/effects';
import difference from 'lodash/difference';

import { MAPPINGS } from '../actions/constants';
import { fetchMappings, addMapping, getVersion } from '../apis';
import {
	fetchMappingsSuccess,
	fetchMappingsFailure,
	setError,
	addMappingSuccess,
	addMappingFailure,
	clearError,
	setVersion,
} from '../actions';
import { getAppname, getUrl } from '../reducers/app';
import { isEmptyObject } from '../utils';
import {
	extractColumns,
	META_FIELDS,
	getMappingsTree,
	getTermsAggregationColumns,
	getSortableColumns,
	hasNestedColumns,
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
		const version = yield call(getVersion, url, appname);
		const versionCode = parseInt(version.charAt(0), 10);

		yield put(setVersion(versionCode));

		if (!isEmptyObject(data)) {
			const indexes = Object.keys(data);
			let properties = {};
			let nestedProperties = {};
			const types = [];
			const indexTypeMap = {};
			const typePropertyMapping = {};

			indexes.forEach(index => {
				if (versionCode === 7) {
					data[index].mappings = {
						_doc: { ...data[index].mappings },
					};
				}
				let typesList = Object.keys(data[index].mappings);
				typesList = difference(typesList, INGNORE_META_TYPES);
				if (typesList.length) {
					typesList.forEach(type => {
						const typeProperties =
							data[index].mappings[type].properties || {};
						indexTypeMap[index] = [
							...(indexTypeMap[index] || []),
							type,
						];
						types.push(type);
						properties = {
							...properties,
							...typeProperties,
						};
						nestedProperties = {
							...properties,
							...getMappingsTree(typeProperties),
						};

						typePropertyMapping[index] = {};
						typePropertyMapping[index][type] = getMappingsTree(
							typeProperties,
						);
					});
				} else {
					const typeName = versionCode >= 6 ? '_doc' : 'doc';

					types.push(typeName);
					indexTypeMap[index] = [typeName];
					typePropertyMapping[index] = {};
					typePropertyMapping[index][typeName] = {};
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

			const searchColumns = Object.keys(properties).filter(
				property =>
					properties[property].type === 'string' ||
					properties[property].type === 'text' ||
					(properties[property] &&
						properties[property].type === 'keyword' &&
						versionCode < 7),
			);

			const nestedSearchColumns = Object.keys(nestedProperties).filter(
				property =>
					nestedProperties[property].type === 'string' ||
					nestedProperties[property].type === 'text' ||
					(properties[property] &&
						properties[property].type === 'keyword' &&
						versionCode < 7),
			);

			const searchableColumns = [
				...searchColumns,
				...searchColumns.map(field => `${field}.raw`),
				...searchColumns.map(field => `${field}.search`),
				...searchColumns.map(field => `${field}.autosuggest`),
			];
			const searchableColumnsWeights = [
				...Array(searchColumns.length).fill(3),
				...Array(searchColumns.length).fill(3),
				...Array(searchColumns.length).fill(1),
				...Array(searchColumns.length).fill(1),
				1,
			];

			const nestedSearchableColumns = [
				...nestedSearchColumns,
				...nestedSearchColumns.map(field => `${field}.raw`),
				...nestedSearchColumns.map(field => `${field}.search`),
				...nestedSearchColumns.map(field => `${field}.autosuggest`),
			];
			const nestedSearchableColumnsWeights = [
				...Array(nestedSearchColumns.length).fill(3),
				...Array(nestedSearchColumns.length).fill(3),
				...Array(nestedSearchColumns.length).fill(1),
				...Array(nestedSearchColumns.length).fill(1),
			];

			// _id is not searchable from v7
			if (versionCode < 7) {
				searchableColumns.push('_id');
				searchableColumnsWeights.push(1);
				nestedSearchableColumns.push('_id');
				nestedSearchableColumnsWeights.push(1);
			}

			const termsAggregationColumns = [
				'_type',
				'_index',
				...getTermsAggregationColumns(properties),
				...getTermsAggregationColumns(nestedProperties),
			];

			const sortableColumns = [
				'_type',
				'_index',
				...getSortableColumns(properties),
				...getSortableColumns(nestedProperties),
			];

			const shouldShowNestedSwitch = hasNestedColumns(
				properties,
				nestedProperties,
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
					termsAggregationColumns,
					sortableColumns,
					shouldShowNestedSwitch,
					searchableColumnsWeights,
					nestedSearchableColumnsWeights,
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
