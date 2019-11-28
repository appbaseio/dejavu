"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getError = void 0;

var _constants = require("../actions/constants");

const error = function error() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  let action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _constants.ERROR.SET_ERROR:
      return action.error;

    case _constants.ERROR.CLEAR_ERROR:
      return null;

    default:
      return state;
  }
};

const getError = state => state.error;

exports.getError = getError;
var _default = error;
exports.default = _default;