"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getSort = void 0;

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.sort");

var _constants = require("../actions/constants");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const defaultState = {
  order: 'desc',
  field: '_score'
};

const sort = function sort() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  const {
    order,
    field
  } = action;

  switch (action.type) {
    case _constants.SORT.SET_SORT:
      return _objectSpread({}, state, {
        order,
        field
      });

    case _constants.SORT.RESET_SORT:
      return defaultState;

    default:
      return state;
  }
};

const getSort = state => state.sort;

exports.getSort = getSort;
var _default = sort;
exports.default = _default;