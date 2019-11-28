"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getStats = void 0;

var _constants = require("../actions/constants");

const statsReducers = function statsReducers() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let action = arguments.length > 1 ? arguments[1] : undefined;
  const {
    stats,
    type
  } = action;

  switch (type) {
    case _constants.STATS.SET_STATS:
      return stats;

    default:
      return state;
  }
};

const getStats = state => state.stats;

exports.getStats = getStats;
var _default = statsReducers;
exports.default = _default;