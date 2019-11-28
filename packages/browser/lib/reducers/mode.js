"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getMode = void 0;

var _constants = require("../actions/constants");

var _constants2 = require("../constants");

const mode = function mode() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _constants2.MODES.EDIT;
  let action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _constants.MODE.SET_MODE:
      return action.mode;

    default:
      return state;
  }
};

const getMode = state => state.mode;

exports.getMode = getMode;
var _default = mode;
exports.default = _default;