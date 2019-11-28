"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("./constants");

const setVersion = version => ({
  type: _constants.VERSION.SET_VERSION,
  version
});

var _default = setVersion;
exports.default = _default;