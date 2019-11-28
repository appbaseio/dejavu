"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getAnalyzers = void 0;

var _constants = require("../actions/constants");

const analyzer = function analyzer() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  let action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _constants.ANALYZERS.SET_ANALYZERS:
      return action.analyzers;

    default:
      return state;
  }
};

const getAnalyzers = state => state.analyzers;

exports.getAnalyzers = getAnalyzers;
var _default = analyzer;
exports.default = _default;