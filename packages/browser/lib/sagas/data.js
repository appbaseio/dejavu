"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = watchAddDataRequest;

var _effects = require("redux-saga/effects");

var _constants = require("../actions/constants");

var _apis = require("../apis");

var _actions = require("../actions");

var _app = require("../reducers/app");

var _mappings = require("./mappings");

function* handleAddData(_ref) {
  let {
    indexName,
    typeName,
    docId,
    data,
    tab,
    version
  } = _ref;

  try {
    yield (0, _effects.put)((0, _actions.clearError)());
    const url = yield (0, _effects.select)(_app.getUrl);
    yield (0, _effects.call)(_apis.addData, indexName, typeName, docId, url, data, version);

    if (tab === 'json') {
      yield (0, _effects.call)(_mappings.handleFetchMappings);
    }

    yield (0, _effects.put)((0, _actions.addDataSuccess)());
  } catch (error) {
    yield (0, _effects.put)((0, _actions.addDataFailure)());
    yield (0, _effects.put)((0, _actions.setError)(error));
  }
}

function* watchAddDataRequest() {
  yield (0, _effects.takeEvery)(_constants.DATA.ADD_DATA_REQUEST, handleAddData);
}