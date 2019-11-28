"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getSelectAll = void 0;

var _constants = require("../actions/constants");

const selectAllReducer = function selectAllReducer() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  const {
    selectAll
  } = action;

  switch (action.type) {
    case _constants.SELECT_ALL.SET_SELECT_ALL:
      return selectAll;

    default:
      return state;
  }
};

const getSelectAll = state => state.selectAll;

exports.getSelectAll = getSelectAll;
var _default = selectAllReducer;
exports.default = _default;