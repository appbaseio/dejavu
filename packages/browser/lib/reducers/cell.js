"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getHighlightCell = exports.getActiveCell = void 0;

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

var _constants = require("../actions/constants");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const initialState = {
  activeCell: {
    row: null,
    column: null
  },
  highlightCell: {
    row: null,
    column: null
  }
};

const cell = function cell() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  const {
    type,
    row,
    column
  } = action;

  switch (type) {
    case _constants.CELL.CELL_ACTIVE:
      return _objectSpread({}, state, {
        activeCell: {
          row,
          column
        }
      });

    case _constants.CELL.CELL_HIGHLIGHT:
      return _objectSpread({}, state, {
        highlightCell: {
          row,
          column
        }
      });

    case _constants.CELL.CELL_SETVALUE_FAILURE:
      return state;

    default:
      return state;
  }
}; // selectors


const getActiveCell = state => state.cell.activeCell;

exports.getActiveCell = getActiveCell;

const getHighlightCell = state => state.cell.highlightCell;

exports.getHighlightCell = getHighlightCell;
var _default = cell;
exports.default = _default;