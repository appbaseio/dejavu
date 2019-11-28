"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getNesetedSearchableColumnsWeights = exports.getSearchableColumnsWeights = exports.getShouldShowNestedSwitch = exports.getSortableColumns = exports.getTermsAggregationColumns = exports.getNestedSearchableColumns = exports.getNestedVisibleColumns = exports.getNestedColumns = exports.getTypePropertyMapping = exports.getSearchableColumns = exports.getVisibleColumns = exports.getColumns = exports.getIndexTypeMap = exports.getTypes = exports.getIndexes = exports.getIsLoading = exports.getMappings = void 0;

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

var _constants = require("../actions/constants");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const initialState = {
  data: null,
  isLoading: false,
  indexes: [],
  types: [],
  indexTypeMap: {},
  columns: [],
  visibleColumns: [],
  searchableColumns: [],
  typePropertyMapping: {},
  nestedVisibleColumns: [],
  nestedSearchableColumns: [],
  nestedColumns: [],
  termsAggregationColumns: [],
  sortableColumns: [],
  shouldShowNestedSwitch: false
};

const mappings = function mappings() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  const {
    data,
    type,
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
    appName,
    termsAggregationColumns,
    sortableColumns,
    shouldShowNestedSwitch,
    searchableColumnsWeights,
    nestedSearchableColumnsWeights
  } = action;

  switch (type) {
    case _constants.MAPPINGS.MAPPINGS_FETCH_REQUEST:
      return _objectSpread({}, state, {
        isLoading: true
      });

    case _constants.MAPPINGS.MAPPINGS_FETCH_SUCCESS:
      return _objectSpread({}, state, {
        data,
        indexes,
        types,
        indexTypeMap,
        isLoading: false,
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

    case _constants.MAPPINGS.MAPPINGS_FETCH_FAILURE:
      return _objectSpread({}, state, {
        isLoading: false
      });

    case _constants.MAPPINGS.SET_VISIBLE_COLUMNS:
      return _objectSpread({}, state, {
        visibleColumns
      });

    case _constants.MAPPINGS.SET_NESTED_VISIBLE_COLUMNS:
      return _objectSpread({}, state, {
        nestedVisibleColumns
      });

    case _constants.MAPPINGS.SET_ARRAY_FIELDS:
      return _objectSpread({}, state, {
        nestedColumns,
        nestedVisibleColumns,
        typePropertyMapping,
        data: {
          [appName]: _objectSpread({}, state.data[appName], {
            nestedProperties: _objectSpread({}, state.data[appName].nestedProperties, {}, action.nestedMappings)
          })
        }
      });

    default:
      return state;
  }
}; // selectors


const getMappings = state => state.mappings.data;

exports.getMappings = getMappings;

const getIsLoading = state => state.mappings.isLoading;

exports.getIsLoading = getIsLoading;

const getIndexes = state => state.mappings.indexes;

exports.getIndexes = getIndexes;

const getTypes = state => state.mappings.types;

exports.getTypes = getTypes;

const getIndexTypeMap = state => state.mappings.indexTypeMap;

exports.getIndexTypeMap = getIndexTypeMap;

const getColumns = state => state.mappings.columns;

exports.getColumns = getColumns;

const getVisibleColumns = state => state.mappings.visibleColumns;

exports.getVisibleColumns = getVisibleColumns;

const getSearchableColumns = state => state.mappings.searchableColumns;

exports.getSearchableColumns = getSearchableColumns;

const getTypePropertyMapping = state => state.mappings.typePropertyMapping;

exports.getTypePropertyMapping = getTypePropertyMapping;

const getNestedColumns = state => state.mappings.nestedColumns;

exports.getNestedColumns = getNestedColumns;

const getNestedVisibleColumns = state => state.mappings.nestedVisibleColumns;

exports.getNestedVisibleColumns = getNestedVisibleColumns;

const getNestedSearchableColumns = state => state.mappings.nestedSearchableColumns;

exports.getNestedSearchableColumns = getNestedSearchableColumns;

const getTermsAggregationColumns = state => state.mappings.termsAggregationColumns;

exports.getTermsAggregationColumns = getTermsAggregationColumns;

const getSortableColumns = state => state.mappings.sortableColumns;

exports.getSortableColumns = getSortableColumns;

const getShouldShowNestedSwitch = state => state.mappings.shouldShowNestedSwitch;

exports.getShouldShowNestedSwitch = getShouldShowNestedSwitch;

const getSearchableColumnsWeights = state => state.mappings.searchableColumnsWeights;

exports.getSearchableColumnsWeights = getSearchableColumnsWeights;

const getNesetedSearchableColumnsWeights = state => state.mappings.nestedSearchableColumnsWeights;

exports.getNesetedSearchableColumnsWeights = getNesetedSearchableColumnsWeights;
var _default = mappings;
exports.default = _default;