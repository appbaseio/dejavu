"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("./constants");

const setSelectAll = selectAll => ({
  type: _constants.SELECT_ALL.SET_SELECT_ALL,
  selectAll
});

var _default = setSelectAll;
exports.default = _default;