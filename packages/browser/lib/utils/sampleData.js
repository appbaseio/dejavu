"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.extractSource = void 0;

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

var _moment = _interopRequireDefault(require("moment"));

var _mappings = require("./mappings");

var _date = _interopRequireDefault(require("./date"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const extractSource = data => {
  const source = _objectSpread({}, data);

  _mappings.META_FIELDS.forEach(item => {
    delete source[item];
  });

  return source;
};

exports.extractSource = extractSource;

const getSampleData = properties => {
  const data = {};
  Object.keys(properties).forEach(item => {
    if (_mappings.META_FIELDS.indexOf(item) === -1) {
      switch (properties[item].type) {
        case 'boolean':
          data[item] = false;
          break;

        case 'integer':
        case 'float':
        case 'long':
        case 'double':
          data[item] = 0;
          break;

        case 'date':
          data[item] = properties[item].format ? (0, _moment.default)().format((0, _date.default)(properties[item].format)) : (0, _moment.default)().format('x');
          break;

        case 'object':
        case 'geo_point':
        case 'geo_shape':
          data[item] = {
            lat: '1.34',
            long: '2.4'
          };
          break;

        case 'string':
        case 'text':
        case 'keyword':
          data[item] = '';
          break;

        default:
          data[item] = {};
      }
    }
  });
  return data;
};

var _default = getSampleData;
exports.default = _default;