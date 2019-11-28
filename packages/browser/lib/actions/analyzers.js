"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("./constants");

const setAnalyzers = analyzers => ({
  type: _constants.ANALYZERS.SET_ANALYZERS,
  analyzers
});

var _default = setAnalyzers;
exports.default = _default;