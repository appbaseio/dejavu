"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("./constants");

const setQuery = query => ({
  type: _constants.QUERY.SET_QUERY,
  query
});

var _default = setQuery;
exports.default = _default;