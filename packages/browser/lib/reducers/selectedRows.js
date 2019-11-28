"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getSelectedRows = void 0;

var _constants = require("../actions/constants");

const selectedRows = function selectedRows() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  let action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _constants.SELECTED_ROWS.SET_SELECTED_ROWS:
      return action.selectedRows;

    default:
      return state;
  }
};

const getSelectedRows = state => state.selectedRows;

exports.getSelectedRows = getSelectedRows;
var _default = selectedRows;
exports.default = _default;