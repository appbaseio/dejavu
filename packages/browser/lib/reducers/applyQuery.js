"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getApplyQuery = void 0;

var _constants = require("../actions/constants");

const applyQueryReducer = function applyQueryReducer() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  const {
    applyQuery
  } = action;

  switch (action.type) {
    case _constants.APPLY_QUERY.SET_APPLY_QUERY:
      return applyQuery;

    default:
      return state;
  }
};

const getApplyQuery = state => state.applyQuery;

exports.getApplyQuery = getApplyQuery;
var _default = applyQueryReducer;
exports.default = _default;