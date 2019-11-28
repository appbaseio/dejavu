"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setArrayFields = exports.setNestedVisibleColumns = exports.setVisibleColumns = exports.addMappingFailure = exports.addMappingSuccess = exports.addMappingRequest = exports.fetchMappingsFailure = exports.fetchMappingsSuccess = exports.fetchMappings = void 0;

var _constants = require("./constants");

const fetchMappings = () => ({
  type: _constants.MAPPINGS.MAPPINGS_FETCH_REQUEST
});

exports.fetchMappings = fetchMappings;

const fetchMappingsSuccess = (data, indexes, types, indexTypeMap, columns, visibleColumns, searchableColumns, typePropertyMapping, nestedVisibleColumns, nestedSearchableColumns, nestedColumns, termsAggregationColumns, sortableColumns, shouldShowNestedSwitch, searchableColumnsWeights, nestedSearchableColumnsWeights) => ({
  type: _constants.MAPPINGS.MAPPINGS_FETCH_SUCCESS,
  data,
  indexes,
  types,
  indexTypeMap,
  columns,
  visibleColumns,
  searchableColumns,
  typePropertyMapping,
  nestedVisibleColumns,
  nestedSearchableColumns,
  nestedColumns,
  termsAggregationColumns,
  sortableColumns,
  shouldShowNestedSwitch,
  searchableColumnsWeights,
  nestedSearchableColumnsWeights
});

exports.fetchMappingsSuccess = fetchMappingsSuccess;

const fetchMappingsFailure = () => ({
  type: _constants.MAPPINGS.MAPPINGS_FETCH_FAILURE
});

exports.fetchMappingsFailure = fetchMappingsFailure;

const addMappingRequest = (indexName, typeName, field, mapping, version) => ({
  type: _constants.MAPPINGS.ADD_MAPPING_REQUEST,
  field,
  mapping,
  indexName,
  typeName,
  version
});

exports.addMappingRequest = addMappingRequest;

const addMappingSuccess = () => ({
  type: _constants.MAPPINGS.ADD_MAPPING_SUCCESS
});

exports.addMappingSuccess = addMappingSuccess;

const addMappingFailure = () => ({
  type: _constants.MAPPINGS.ADD_MAPPING_FAILURE
});

exports.addMappingFailure = addMappingFailure;

const setVisibleColumns = visibleColumns => ({
  type: _constants.MAPPINGS.SET_VISIBLE_COLUMNS,
  visibleColumns
});

exports.setVisibleColumns = setVisibleColumns;

const setNestedVisibleColumns = nestedVisibleColumns => ({
  type: _constants.MAPPINGS.SET_NESTED_VISIBLE_COLUMNS,
  nestedVisibleColumns
});

exports.setNestedVisibleColumns = setNestedVisibleColumns;

const setArrayFields = (nestedColumns, nestedVisibleColumns, nestedMappings, appName, typePropertyMapping) => ({
  type: _constants.MAPPINGS.SET_ARRAY_FIELDS,
  nestedColumns,
  nestedVisibleColumns,
  nestedMappings,
  appName,
  typePropertyMapping
});

exports.setArrayFields = setArrayFields;