"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("./constants");

const setUpdatingRow = rowData => ({
  type: _constants.UPDATING_ROW.SET_UPDATING_ROW,
  rowData
});

var _default = setUpdatingRow;
exports.default = _default;