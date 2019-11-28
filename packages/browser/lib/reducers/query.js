"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getQuery = void 0;

var _constants = require("../actions/constants");

const queryReducer = function queryReducer() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let action = arguments.length > 1 ? arguments[1] : undefined;
  const {
    query
  } = action;

  switch (action.type) {
    case _constants.QUERY.SET_QUERY:
      return query;

    default:
      return state;
  }
};

const getQuery = state => state.query;

exports.getQuery = getQuery;
var _default = queryReducer;
exports.default = _default;