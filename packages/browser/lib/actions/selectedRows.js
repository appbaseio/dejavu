"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("./constants");

const setSelectedRows = selectedRows => ({
  type: _constants.SELECTED_ROWS.SET_SELECTED_ROWS,
  selectedRows
});

var _default = setSelectedRows;
exports.default = _default;