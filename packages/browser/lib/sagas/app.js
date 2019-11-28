"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = watchConnectApp;

var _effects = require("redux-saga/effects");

var _constants = require("../actions/constants");

var _apis = require("../apis");

var _actions = require("../actions");

var _utils = require("../utils");

function* handleConnectApp(_ref) {
  let {
    appname,
    url
  } = _ref;
  const appUrl = (0, _utils.trimUrl)(url);

  try {
    yield (0, _effects.put)((0, _actions.clearError)());
    yield (0, _effects.call)(_apis.testConnection, appname, appUrl);
    yield (0, _effects.put)((0, _actions.connectAppSuccess)(appname, appUrl));
  } catch (error) {
    yield (0, _effects.put)((0, _actions.connectAppFailure)());
    yield (0, _effects.put)((0, _actions.setError)({
      message: error.message,
      description: error.description
    }));
  }
}

function* watchConnectApp() {
  yield (0, _effects.takeEvery)(_constants.APP.CONNECT_REQUEST, handleConnectApp);
}