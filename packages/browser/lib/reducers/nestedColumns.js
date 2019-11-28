"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getIsShowingNestedColumns = void 0;

var _constants = require("../actions/constants");

const nestedColumns = function nestedColumns() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  const {
    isShowingNestedColumns
  } = action;

  switch (action.type) {
    case _constants.NESTED_COLUMNS.SET_IS_SHOWING_NESTED_COLUMNS:
      return isShowingNestedColumns;

    default:
      return state;
  }
};

const getIsShowingNestedColumns = state => state.nestedColumns;

exports.getIsShowingNestedColumns = getIsShowingNestedColumns;
var _default = nestedColumns;
exports.default = _default;