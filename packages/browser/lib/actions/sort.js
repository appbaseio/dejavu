"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetSort = exports.setSort = void 0;

var _constants = require("./constants");

const setSort = (order, field) => ({
  type: _constants.SORT.SET_SORT,
  order,
  field
});

exports.setSort = setSort;

const resetSort = () => ({
  type: _constants.SORT.RESET_SORT
});

exports.resetSort = resetSort;