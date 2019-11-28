"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = watchSetCellValueRequest;

var _effects = require("redux-saga/effects");

var _constants = require("../actions/constants");

var _apis = require("../apis");

var _actions = require("../actions");

var _app = require("../reducers/app");

function* handleSetValue(_ref) {
  let {
    id,
    property,
    value,
    index,
    esType
  } = _ref;

  try {
    yield (0, _effects.put)((0, _actions.clearError)());
    const url = yield (0, _effects.select)(_app.getUrl);
    const data = yield (0, _effects.call)(_apis.setCellValue, index, esType, url, id, property, value);
    yield (0, _effects.put)((0, _actions.setCellValueSuccess)(data));
  } catch (error) {
    yield (0, _effects.put)((0, _actions.setCellValueFailure)());
    yield (0, _effects.put)((0, _actions.setError)(error));
  }
}

function* watchSetCellValueRequest() {
  yield (0, _effects.takeEvery)(_constants.CELL.CELL_SETVALUE_REQUEST, handleSetValue);
}