"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("./constants");

const setApplyQuery = applyQuery => ({
  type: _constants.APPLY_QUERY.SET_APPLY_QUERY,
  applyQuery
});

var _default = setApplyQuery;
exports.default = _default;