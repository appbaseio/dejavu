"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("./constants");

// action to list current rendered ids
const setCurrentIds = ids => ({
  type: _constants.CURRENT_IDS.SET_CURRENT_IDS,
  ids
});

var _default = setCurrentIds;
exports.default = _default;