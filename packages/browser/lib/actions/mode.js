"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("./constants");

const setMode = mode => ({
  type: _constants.MODE.SET_MODE,
  mode
});

var _default = setMode;
exports.default = _default;