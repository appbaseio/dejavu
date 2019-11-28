"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getCurrentIds = void 0;

var _constants = require("../actions/constants");

const currentIds = function currentIds() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  let action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _constants.CURRENT_IDS.SET_CURRENT_IDS:
      return action.ids;

    default:
      return state;
  }
};

const getCurrentIds = state => state.currentIds;

exports.getCurrentIds = getCurrentIds;
var _default = currentIds;
exports.default = _default;