"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearError = exports.setError = void 0;

var _constants = require("./constants");

const setError = error => ({
  type: _constants.ERROR.SET_ERROR,
  error
});

exports.setError = setError;

const clearError = () => ({
  type: _constants.ERROR.CLEAR_ERROR
});

exports.clearError = clearError;