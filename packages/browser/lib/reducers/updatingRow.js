"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getUpdatingRow = void 0;

var _constants = require("../actions/constants");

const updatingRow = function updatingRow() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  let action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _constants.UPDATING_ROW.SET_UPDATING_ROW:
      return action.rowData;

    default:
      return state;
  }
};

const getUpdatingRow = state => state.updatingRow;

exports.getUpdatingRow = getUpdatingRow;
var _default = updatingRow;
exports.default = _default;