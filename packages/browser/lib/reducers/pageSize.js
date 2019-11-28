"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getPageSize = void 0;

var _constants = require("../actions/constants");

const pagination = function pagination() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 15;
  let action = arguments.length > 1 ? arguments[1] : undefined;
  const {
    pageSize
  } = action;

  switch (action.type) {
    case _constants.PAGE_SIZE.SET_PAGE_SIZE:
      return pageSize;

    default:
      return state;
  }
};

const getPageSize = state => state.pageSize;

exports.getPageSize = getPageSize;
var _default = pagination;
exports.default = _default;