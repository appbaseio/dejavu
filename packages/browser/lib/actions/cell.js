"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setCellValueFailure = exports.setCellValueSuccess = exports.setCellValueRequest = exports.setCellHighlight = exports.setCellActive = void 0;

var _constants = require("./constants");

const setCellActive = (row, column) => ({
  type: _constants.CELL.CELL_ACTIVE,
  row,
  column
});

exports.setCellActive = setCellActive;

const setCellHighlight = (row, column) => ({
  type: _constants.CELL.CELL_HIGHLIGHT,
  row,
  column
});

exports.setCellHighlight = setCellHighlight;

const setCellValueRequest = (id, property, value, index, esType) => ({
  type: _constants.CELL.CELL_SETVALUE_REQUEST,
  id,
  property,
  value,
  index,
  esType
});

exports.setCellValueRequest = setCellValueRequest;

const setCellValueSuccess = () => ({
  type: _constants.CELL.CELL_SETVALUE_SUCCESS
}); // update data


exports.setCellValueSuccess = setCellValueSuccess;

const setCellValueFailure = () => ({
  type: _constants.CELL.CELL_SETVALUE_FAILURE
});

exports.setCellValueFailure = setCellValueFailure;