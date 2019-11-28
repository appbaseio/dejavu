"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("./constants");

const setStats = stats => ({
  type: _constants.STATS.SET_STATS,
  stats
});

var _default = setStats;
exports.default = _default;