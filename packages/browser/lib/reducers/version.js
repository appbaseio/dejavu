"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getVersion = void 0;

var _constants = require("../actions/constants");

const versionReducer = function versionReducer() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  const {
    version
  } = action;

  switch (action.type) {
    case _constants.VERSION.SET_VERSION:
      return version;

    default:
      return state;
  }
};

const getVersion = state => state.version;

exports.getVersion = getVersion;
var _default = versionReducer;
exports.default = _default;