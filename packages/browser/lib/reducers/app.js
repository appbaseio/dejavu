"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getHeaders = exports.getIsConnected = exports.getIsLoading = exports.getUrl = exports.getAppname = void 0;

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

var _constants = require("../actions/constants");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const initialState = {
  appname: null,
  url: null,
  isConnected: false,
  isLoading: false,
  headers: []
};

const app = function app() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  const {
    appname,
    url,
    type,
    headers
  } = action;

  switch (type) {
    case _constants.APP.CONNECT_REQUEST:
      return _objectSpread({}, state, {
        isLoading: true
      });

    case _constants.APP.CONNECT_SUCCESS:
      return _objectSpread({}, state, {
        appname,
        url,
        isConnected: true,
        isLoading: false
      });

    case _constants.APP.CONNECT_FAILURE:
      return _objectSpread({}, state, {
        isLoading: false
      });

    case _constants.APP.SET_HEADERS:
      return _objectSpread({}, state, {
        headers
      });

    default:
      return state;
  }
}; // selectors


const getAppname = state => state.app.appname;

exports.getAppname = getAppname;

const getUrl = state => state.app.url;

exports.getUrl = getUrl;

const getIsConnected = state => state.app.isConnected;

exports.getIsConnected = getIsConnected;

const getIsLoading = state => state.app.isLoading;

exports.getIsLoading = getIsLoading;

const getHeaders = state => state.app.headers;

exports.getHeaders = getHeaders;
var _default = app;
exports.default = _default;