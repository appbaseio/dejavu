"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getIsLoading = exports.getReactiveListKey = void 0;

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

var _constants = require("../actions/constants");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const initialState = {
  reactiveListKey: 0,
  // to remount ReactiveList and get fresh data
  isLoading: false
}; // a single state for data addition in the app currently, might need separation of concern later

const data = function data() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  const {
    type
  } = action;
  const {
    reactiveListKey
  } = state;

  switch (type) {
    case _constants.DATA.ADD_DATA_REQUEST:
    case _constants.MAPPINGS.ADD_MAPPING_REQUEST:
      return _objectSpread({}, state, {
        isLoading: true
      });

    case _constants.DATA.ADD_DATA_SUCCESS:
      return _objectSpread({}, state, {
        isLoading: false
      });

    case _constants.MAPPINGS.ADD_MAPPING_SUCCESS:
      return _objectSpread({}, state, {
        isLoading: false
      });

    case _constants.DATA.ADD_DATA_FAILURE:
    case _constants.MAPPINGS.ADD_MAPPING_FAILURE:
      return _objectSpread({}, state, {
        isLoading: false
      });

    case _constants.DATA.UPDATE_REACTIVE_LIST:
      return _objectSpread({}, state, {
        reactiveListKey: reactiveListKey + 1
      });

    default:
      return state;
  }
}; // selectors


const getReactiveListKey = state => state.data.reactiveListKey;

exports.getReactiveListKey = getReactiveListKey;

const getIsLoading = state => state.data.isLoading;

exports.getIsLoading = getIsLoading;
var _default = data;
exports.default = _default;