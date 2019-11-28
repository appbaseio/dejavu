"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NUMERIC_DATATYPES = exports.hasNestedColumns = exports.getSortableColumns = exports.updateIndexTypeMapping = exports.getNestedArrayField = exports.getMappingsTree = exports.getTermsAggregationColumns = exports.getSortableTypes = exports.META_FIELDS = exports.es6mappings = exports.extractColumns = void 0;

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.regexp.split");

require("core-js/modules/web.dom.iterable");

var _get = _interopRequireDefault(require("lodash/get"));

var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));

var _date = require("./date");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } }

const extractColumns = (mappings, key) => Object.keys((mappings || {})[key] || []);

exports.extractColumns = extractColumns;
const META_FIELDS = ['_index', '_type', '_score', '_click_id'];
exports.META_FIELDS = META_FIELDS;
const NUMERIC_DATATYPES = ['integer', 'float', 'long', 'double', 'short', 'byte', 'half_float', 'scaled_float'];
exports.NUMERIC_DATATYPES = NUMERIC_DATATYPES;
const es6mappings = {
  'Text: Aggs': {
    type: 'text',
    fields: {
      keyword: {
        type: 'keyword',
        index: 'true',
        ignore_above: 256
      },
      english: {
        type: 'text',
        analyzer: 'english'
      }
    },
    analyzer: 'standard',
    search_analyzer: 'standard'
  },
  'Text: Search': {
    type: 'text',
    fields: {
      keyword: {
        type: 'keyword',
        index: 'true',
        ignore_above: 256
      },
      search: {
        type: 'text',
        index: 'true',
        analyzer: 'ngram_analyzer',
        search_analyzer: 'simple'
      },
      autosuggest: {
        type: 'text',
        index: 'true',
        analyzer: 'autosuggest_analyzer',
        search_analyzer: 'simple'
      },
      english: {
        type: 'text',
        analyzer: 'english'
      }
    },
    analyzer: 'standard',
    search_analyzer: 'standard'
  },
  Long: {
    type: 'long'
  },
  Integer: {
    type: 'integer'
  },
  Double: {
    type: 'double'
  },
  Float: {
    type: 'float'
  },
  Date: {
    type: 'date',
    format: _date.dateFormatMap.date
  },
  Boolean: {
    type: 'boolean'
  },
  'Geo Point': {
    type: 'geo_point'
  },
  'Geo Shape': {
    type: 'geo_shape'
  },
  Image: {
    type: 'text',
    fields: {
      keyword: {
        type: 'keyword',
        index: 'true'
      }
    }
  },
  Keyword: {
    type: 'keyword',
    ignore_above: 256
  }
};
exports.es6mappings = es6mappings;

const getSortableTypes = () => {
  const sortableTypes = Object.keys(es6mappings).reduce((result, value) => {
    if (['Geo Point', 'Geo Shape', 'Image'].indexOf(value) === -1) {
      result.push(es6mappings[value].type);
    }

    return result;
  }, []);
  return [].concat(_toConsumableArray(sortableTypes), ['string']);
};

exports.getSortableTypes = getSortableTypes;

const getSortableColumns = properties => {
  const columns = [];
  const sortableTypes = getSortableTypes();

  if (properties) {
    Object.keys(properties).forEach(item => {
      const {
        type
      } = properties[item];

      if (type && sortableTypes.indexOf(type) > -1) {
        if (properties[item].fields && properties[item].fields.keyword) {
          columns.push("".concat(item, ".keyword"));
        }

        if (properties[item].fields && properties[item].fields.raw) {
          columns.push("".concat(item, ".raw"));
        }

        if (properties[item].originalFields && properties[item].originalFields.keyword) {
          columns.push("".concat(item, ".keyword"));
        }

        if (properties[item].originalFields && properties[item].originalFields.raw) {
          columns.push("".concat(item, ".raw"));
        }

        columns.push(item);
      }
    });
  }

  return columns;
};

exports.getSortableColumns = getSortableColumns;

const getTermsAggregationColumns = properties => {
  const columns = [];

  if (properties) {
    Object.keys(properties).forEach(item => {
      const {
        type
      } = properties[item];

      if (type === 'string') {
        if ((properties[item].originalFields || properties[item].fields || {}).raw) {
          columns.push("".concat(item, ".raw"));
        } else if ((properties[item].originalFields || properties[item].fields || {}).keyword) {
          columns.push("".concat(item, ".keyword"));
        } else {
          columns.push(item);
        }
      }

      if (type === 'text') {
        if ((properties[item].originalFields || properties[item].fields || {}).raw) {
          columns.push("".concat(item, ".raw"));
        } else if ((properties[item].originalFields || properties[item].fields || {}).keyword) {
          columns.push("".concat(item, ".keyword"));
        }
      }

      if ([es6mappings.Long.type, es6mappings.Integer.type, es6mappings.Double.type, es6mappings.Float.type, es6mappings.Date.type, es6mappings.Boolean.type, es6mappings.Keyword.type].indexOf(type) > -1) {
        columns.push(item);
      }
    });
  }

  return columns;
};

exports.getTermsAggregationColumns = getTermsAggregationColumns;

const getFieldsTree = function getFieldsTree() {
  let mappings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  let tree = {};
  Object.keys(mappings).forEach(key => {
    if (mappings[key].properties) {
      tree = _objectSpread({}, tree, {}, getFieldsTree(mappings[key].properties, "".concat(prefix ? "".concat(prefix, ".") : '').concat(key)));
    } else {
      const originalFields = mappings[key].fields;
      tree = _objectSpread({}, tree, {
        ["".concat(prefix ? "".concat(prefix, ".") : '').concat(key)]: {
          type: mappings[key].type,
          fields: mappings[key].fields ? Object.keys(mappings[key].fields) : [],
          originalFields: originalFields || {}
        }
      });
    }
  });
  return tree;
};

const getMappingsTree = function getMappingsTree() {
  let mappings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let tree = {};
  Object.keys(mappings).forEach(key => {
    if (mappings[key].properties) {
      tree = _objectSpread({}, tree, {}, getFieldsTree(mappings[key].properties, key));
    } else if (mappings[key].type) {
      tree = _objectSpread({}, tree, {
        [key]: mappings[key]
      });
    }
  });
  return tree;
};

exports.getMappingsTree = getMappingsTree;

const getNestedArrayField = (data, mappings) => {
  const fieldsToBeDeleted = {};
  const parentFields = {};
  const indexTypeMap = {};
  data.forEach(dataItem => {
    Object.keys(mappings).forEach(col => {
      if (!(0, _get.default)(dataItem, col) && col.indexOf('.') > -1) {
        const parentPath = col.substring(0, col.lastIndexOf('.'));
        const parentData = (0, _get.default)(dataItem, parentPath);

        if (parentData && Array.isArray(parentData)) {
          fieldsToBeDeleted[col] = true;
          parentFields[parentPath] = true;
          indexTypeMap[dataItem._index] = {
            [dataItem._type]: _objectSpread({}, indexTypeMap[dataItem._index] ? indexTypeMap[dataItem._index][dataItem._type] || {} : {}, {
              [parentPath]: true
            })
          };
        }
      }
    });
  });
  return {
    parentFields,
    fieldsToBeDeleted,
    indexTypeMap
  };
}; // function to update mapping of particular type


exports.getNestedArrayField = getNestedArrayField;

const updateIndexTypeMapping = (currentMapping, updatingMap, fieldsToBeDeleted, fullMap) => {
  const newMapping = (0, _cloneDeep.default)(currentMapping);
  Object.keys(updatingMap).forEach(index => {
    Object.keys(updatingMap[index]).forEach(type => {
      Object.keys(updatingMap[index][type]).forEach(key => {
        newMapping[index][type][key] = (0, _get.default)(fullMap.properties, key.split('.').join('.properties.'));
      });
      fieldsToBeDeleted.forEach(field => {
        delete newMapping[index][type][field];
      });
    });
  });
  return newMapping;
};

exports.updateIndexTypeMapping = updateIndexTypeMapping;

const hasNestedColumns = (originalProperties, nestedProperties) => Object.keys(originalProperties).length !== Object.keys(nestedProperties).length;

exports.hasNestedColumns = hasNestedColumns;