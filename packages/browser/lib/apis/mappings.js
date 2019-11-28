"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addMapping = exports.fetchMappings = void 0;

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

var _utils = require("../utils");

var _CustomError = _interopRequireDefault(require("../utils/CustomError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const fetchMappings = async (appname, rawUrl) => {
  const defaultError = 'Unable to fetch mappings';

  try {
    const {
      url
    } = (0, _utils.parseUrl)(rawUrl);
    const headers = (0, _utils.getHeaders)(rawUrl);
    const customHeaders = (0, _utils.getCustomHeaders)(appname);
    const res = await fetch("".concat(url, "/").concat(appname, "/_mapping"), {
      headers: _objectSpread({}, headers, {}, (0, _utils.convertArrayToHeaders)(customHeaders))
    }).then(response => response.json());

    if (res.status >= 400) {
      throw new _CustomError.default(JSON.stringify(res.error, null, 2), "HTTP STATUS: ".concat(res.status, " - ").concat(defaultError));
    }

    return res;
  } catch (error) {
    throw new _CustomError.default(error.description || defaultError, error.message, error.stack);
  }
};

exports.fetchMappings = fetchMappings;

const addMapping = async (indexName, typeName, rawUrl, field, mapping, version) => {
  const defaultError = 'Unable to add mapping';

  try {
    const {
      url
    } = (0, _utils.parseUrl)(rawUrl);
    const headers = (0, _utils.getHeaders)(rawUrl);
    const customHeaders = (0, _utils.getCustomHeaders)(indexName);
    const apiUrl = "".concat(url, "/").concat(indexName, "/_mapping").concat(version === 7 ? '' : "/".concat(typeName));
    const res = await fetch(apiUrl, {
      headers: _objectSpread({}, headers, {}, (0, _utils.convertArrayToHeaders)(customHeaders)),
      method: 'PUT',
      body: JSON.stringify({
        properties: {
          [field]: mapping
        }
      })
    }).then(response => response.json());

    if (res.status >= 400) {
      throw new _CustomError.default(JSON.stringify(res.error, null, 2), "HTTP STATUS: ".concat(res.status, " - ").concat(defaultError));
    }

    return res;
  } catch (error) {
    throw new _CustomError.default(error.description || defaultError, error.message, error.stack);
  }
};

exports.addMapping = addMapping;