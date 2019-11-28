"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("./constants");

const setPageSize = pageSize => ({
  type: _constants.PAGE_SIZE.SET_PAGE_SIZE,
  pageSize
});

var _default = setPageSize;
exports.default = _default;