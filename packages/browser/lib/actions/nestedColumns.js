"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("./constants");

const setIsShwoingNestedColumn = isShowingNestedColumns => ({
  type: _constants.NESTED_COLUMNS.SET_IS_SHOWING_NESTED_COLUMNS,
  isShowingNestedColumns
});

var _default = setIsShwoingNestedColumn;
exports.default = _default;