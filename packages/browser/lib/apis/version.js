"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/web.dom.iterable");

var _CustomError = _interopRequireDefault(require("../utils/CustomError"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = async (rawUrl, indexName) => {
  const defaultError = 'Unable to get version';

  try {
    const {
      url
    } = (0, _utils.parseUrl)(rawUrl);
    const headers = (0, _utils.getHeaders)(rawUrl);
    let fetchUrl = url;
    let fetchHeaders = {};

    if (indexName) {
      fetchUrl = "".concat(url, "/").concat(indexName, "/_settings");
      fetchHeaders = (0, _utils.convertArrayToHeaders)((0, _utils.getCustomHeaders)(indexName));
    }

    const res = await fetch(fetchUrl, {
      headers: _objectSpread({}, headers, {}, fetchHeaders),
      method: 'GET'
    }).then(response => response.json());

    if (res.status >= 400) {
      throw new _CustomError.default(JSON.stringify(res.error, null, 2), "HTTP STATUS: ".concat(res.status, " - ").concat(defaultError));
    }

    let version = '';

    if (indexName) {
      const defaultIndex = Object.keys(res)[0];

      if (defaultIndex) {
        version = res[defaultIndex].settings.index.version.upgraded || res[defaultIndex].settings.index.version.created;
      } else {
        version = '5';
      }
    } else {
      version = res.version.number;
    }

    return version.replace(/\./g, '');
  } catch (error) {
    throw new _CustomError.default(error.description || defaultError, error.message, error.stack);
  }
};

exports.default = _default;