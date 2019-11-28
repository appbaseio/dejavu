"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

var _flat = require("flat");

var _utils = require("../utils");

var _CustomError = _interopRequireDefault(require("../utils/CustomError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const setCellValue = async (app, type, rawUrl, id, property, value) => {
  const defaultError = 'Unable to update data';

  try {
    const {
      url
    } = (0, _utils.parseUrl)(rawUrl);
    const headers = (0, _utils.getHeaders)(rawUrl);
    const customHeaders = (0, _utils.getCustomHeaders)(app);
    const doc = (0, _flat.unflatten)({
      [property]: value
    });
    const formattedId = encodeURIComponent(id);
    const res = await fetch("".concat(url, "/").concat(app, "/").concat(type, "/").concat(formattedId, "/_update"), {
      headers: _objectSpread({}, headers, {}, (0, _utils.convertArrayToHeaders)(customHeaders)),
      method: 'POST',
      body: JSON.stringify({
        doc
      })
    }).then(response => response.json());

    if (res.status >= 400) {
      throw new _CustomError.default(JSON.stringify(res.error || res, null, 2), "HTTP STATUS: ".concat(res.status, " - ").concat(res.message || defaultError));
    }

    return res;
  } catch (error) {
    const errorMessage = error.message || 'Unable to update data';
    throw new _CustomError.default(error.description || errorMessage, errorMessage, error.stack);
  }
};

var _default = setCellValue;
exports.default = _default;