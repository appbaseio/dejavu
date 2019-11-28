"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

var _utils = require("../utils");

var _CustomError = _interopRequireDefault(require("../utils/CustomError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const testConnection = async (appname, rawUrl) => {
  const defaultError = 'Unable to connect';

  try {
    const {
      url
    } = (0, _utils.parseUrl)(rawUrl);
    const headers = (0, _utils.getHeaders)(rawUrl);
    const customHeaders = (0, _utils.getCustomHeaders)(appname);
    const res = await fetch("".concat(url, "/").concat(appname), {
      'Content-Type': 'application/json',
      headers: _objectSpread({}, headers, {}, (0, _utils.convertArrayToHeaders)(customHeaders))
    }).then(response => response.json());

    if (res.status >= 400) {
      throw new _CustomError.default(JSON.stringify(res.error, null, 2), "HTTP STATUS: ".concat(res.status, " - ").concat(defaultError));
    }

    if ((0, _utils.isEmptyObject)(res)) {
      throw new _CustomError.default(JSON.stringify({
        error: "Unable to find ".concat(appname)
      }, null, 2), "Error: Index not found");
    }

    return res;
  } catch (error) {
    const err = error;
    let description = "<b> Possible Errors </b>\n\t\t<ul><li>Invalid connection string or index name </li>\n\t\t<li> Please check if Elasticsearch cluster is up and running</li></ul>";

    if (err.message === 'Failed to fetch') {
      err.message = defaultError;
    }

    if (err.message === 'NetworkError when attempting to fetch resource.') {
      description = "You are trying to load http content over https.\n\t\t\t\tYou might have to enable mixed content of your browser\n\t\t\t\t<a target=\"_blank\" href=\"https://kb.iu.edu/d/bdny\">https://kb.iu.edu/d/bdny</a>";
    }

    throw new _CustomError.default(err.description && !(0, _utils.isEmptyObject)(JSON.parse(err.description)) ? err.description : description, err.message || defaultError, err.stack);
  }
};

var _default = testConnection;
exports.default = _default;