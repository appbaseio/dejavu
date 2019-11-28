"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleFetchMappings = handleFetchMappings;
exports.default = mappingsWatcher;

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

var _effects = require("redux-saga/effects");

var _difference = _interopRequireDefault(require("lodash/difference"));

var _constants = require("../actions/constants");

var _apis = require("../apis");

var _actions = require("../actions");

var _app = require("../reducers/app");

var _utils = require("../utils");

var _mappings = require("../utils/mappings");

var _CustomError = _interopRequireDefault(require("../utils/CustomError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const IGNORE_META_TYPES = ['~logs', '.percolator', '~percolator', '_default_'];

function* handleFetchMappings() {
  const defaultError = 'Unable to get mappings';
  const defaultErrorDescription = 'Please add mappings';

  try {
    yield (0, _effects.put)((0, _actions.clearError)());
    const appname = yield (0, _effects.select)(_app.getAppname);
    const url = yield (0, _effects.select)(_app.getUrl);
    const data = yield (0, _effects.call)(_apis.fetchMappings, appname, url);
    const version = yield (0, _effects.call)(_apis.getVersion, url, appname);
    const versionCode = parseInt(version.charAt(0), 10);
    yield (0, _effects.put)((0, _actions.setVersion)(versionCode));

    if (!(0, _utils.isEmptyObject)(data)) {
      const indexes = Object.keys(data);
      let properties = {};
      let nestedProperties = {};
      const types = [];
      const indexTypeMap = {};
      const typePropertyMapping = {};
      indexes.forEach(index => {
        if (versionCode === 7) {
          data[index].mappings = {
            _doc: _objectSpread({}, data[index].mappings)
          };
        }

        let typesList = Object.keys(data[index].mappings);
        typesList = (0, _difference.default)(typesList, IGNORE_META_TYPES);

        if (typesList.length) {
          typesList.forEach(type => {
            const typeProperties = data[index].mappings[type].properties;
            indexTypeMap[index] = [].concat(_toConsumableArray(indexTypeMap[index] || []), [type]);
            types.push(type);
            properties = _objectSpread({}, properties, {}, typeProperties);
            nestedProperties = _objectSpread({}, properties, {}, (0, _mappings.getMappingsTree)(typeProperties));

            if (!typePropertyMapping[index]) {
              typePropertyMapping[index] = {};
            }

            typePropertyMapping[index][type] = (0, _mappings.getMappingsTree)(typeProperties);
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
          nestedProperties
        }
      };
      const allColumns = [].concat(_toConsumableArray(_mappings.META_FIELDS), _toConsumableArray((0, _mappings.extractColumns)(mappings[appname], 'properties')));
      const allNestedColumns = [].concat(_toConsumableArray(_mappings.META_FIELDS), _toConsumableArray((0, _mappings.extractColumns)(mappings[appname], 'nestedProperties')));
      let visibleColumns = allColumns.filter(col => col !== '_type' && col !== '_score' && col !== '_click_id');

      if (indexes.length <= 1) {
        visibleColumns = visibleColumns.filter(col => col !== '_index');
      }

      let nestedVisibleColumns = allNestedColumns.filter(col => col !== '_type' && col !== '_score' && col !== '_click_id');

      if (indexes.length <= 1) {
        nestedVisibleColumns = nestedVisibleColumns.filter(col => col !== '_index');
      }

      const filteredTypes = types.filter(type => !IGNORE_META_TYPES.includes(type));
      const searchColumns = Object.keys(properties).filter(property => properties[property].type === 'string' || properties[property].type === 'text' || // .keyword field prefix phrase is not allowed in v7
      properties[property] && properties[property].type === 'keyword' && versionCode < 7);
      const nestedSearchColumns = Object.keys(nestedProperties).filter(property => nestedProperties[property].type === 'string' || nestedProperties[property].type === 'text' || properties[property] && properties[property].type === 'keyword' && versionCode < 7);
      const searchableColumns = [].concat(_toConsumableArray(searchColumns), _toConsumableArray(searchColumns.map(field => "".concat(field, ".raw"))), _toConsumableArray(searchColumns.map(field => "".concat(field, ".search"))), _toConsumableArray(searchColumns.map(field => "".concat(field, ".autosuggest"))), _toConsumableArray(searchColumns.map(field => "".concat(field, ".english"))));
      const searchableColumnsWeights = [].concat(_toConsumableArray(Array(searchColumns.length).fill(3)), _toConsumableArray(Array(searchColumns.length).fill(3)), _toConsumableArray(Array(searchColumns.length).fill(1)), _toConsumableArray(Array(searchColumns.length).fill(1)), _toConsumableArray(Array(searchColumns.length).fill(1)));
      const nestedSearchableColumns = [].concat(_toConsumableArray(nestedSearchColumns), _toConsumableArray(nestedSearchColumns.map(field => "".concat(field, ".raw"))), _toConsumableArray(nestedSearchColumns.map(field => "".concat(field, ".search"))), _toConsumableArray(nestedSearchColumns.map(field => "".concat(field, ".autosuggest"))), _toConsumableArray(nestedSearchColumns.map(field => "".concat(field, ".english"))));
      const nestedSearchableColumnsWeights = [].concat(_toConsumableArray(Array(nestedSearchColumns.length).fill(3)), _toConsumableArray(Array(nestedSearchColumns.length).fill(3)), _toConsumableArray(Array(nestedSearchColumns.length).fill(1)), _toConsumableArray(Array(nestedSearchColumns.length).fill(1)), _toConsumableArray(Array(nestedSearchColumns.length).fill(1))); // _id is not searchable from v7

      if (versionCode < 7) {
        searchableColumns.push('_id');
        searchableColumnsWeights.push(1);
        nestedSearchableColumns.push('_id');
        nestedSearchableColumnsWeights.push(1);
      }

      const termsAggregationColumns = _toConsumableArray(new Set(['_type', '_index'].concat(_toConsumableArray((0, _mappings.getTermsAggregationColumns)(properties)), _toConsumableArray((0, _mappings.getTermsAggregationColumns)(nestedProperties)))));

      const sortableColumns = _toConsumableArray(new Set(['_type', '_index'].concat(_toConsumableArray((0, _mappings.getSortableColumns)(properties)), _toConsumableArray((0, _mappings.getSortableColumns)(nestedProperties)))));

      const shouldShowNestedSwitch = (0, _mappings.hasNestedColumns)(properties, nestedProperties);
      yield (0, _effects.put)((0, _actions.fetchMappingsSuccess)(mappings, indexes, filteredTypes, indexTypeMap, allColumns, visibleColumns, searchableColumns, typePropertyMapping, nestedVisibleColumns, nestedSearchableColumns, allNestedColumns, termsAggregationColumns, sortableColumns, shouldShowNestedSwitch, searchableColumnsWeights, nestedSearchableColumnsWeights));
    } else {
      throw new _CustomError.default(defaultErrorDescription, defaultError);
    }
  } catch (error) {
    yield (0, _effects.put)((0, _actions.fetchMappingsFailure)());
    yield (0, _effects.put)((0, _actions.setError)(error));
  }
}

function* handleAddMapping(_ref) {
  let {
    indexName,
    typeName,
    field,
    mapping,
    version
  } = _ref;

  try {
    yield (0, _effects.put)((0, _actions.clearError)());
    const url = yield (0, _effects.select)(_app.getUrl);
    yield (0, _effects.call)(_apis.addMapping, indexName, typeName, url, field, mapping, version);
    yield (0, _effects.call)(handleFetchMappings); // sagas FTW

    yield (0, _effects.put)((0, _actions.addMappingSuccess)());
  } catch (error) {
    yield (0, _effects.put)((0, _actions.addMappingFailure)());
    yield (0, _effects.put)((0, _actions.setError)(error));
  }
}

function* watchAddMapping() {
  yield (0, _effects.takeLatest)(_constants.MAPPINGS.ADD_MAPPING_REQUEST, handleAddMapping);
}

function* watchFetchMappings() {
  yield (0, _effects.takeLatest)(_constants.MAPPINGS.MAPPINGS_FETCH_REQUEST, handleFetchMappings);
}

function* mappingsWatcher() {
  yield (0, _effects.all)([watchAddMapping(), watchFetchMappings()]);
}