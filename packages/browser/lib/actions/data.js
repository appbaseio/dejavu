"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateReactiveList = exports.addDataFailure = exports.addDataSuccess = exports.addDataRequest = void 0;

var _constants = require("./constants");

const addDataRequest = (indexName, typeName, docId, data, tab, version) => ({
  type: _constants.DATA.ADD_DATA_REQUEST,
  indexName,
  typeName,
  docId,
  data,
  tab,
  version
});

exports.addDataRequest = addDataRequest;

const addDataSuccess = () => ({
  type: _constants.DATA.ADD_DATA_SUCCESS
});

exports.addDataSuccess = addDataSuccess;

const addDataFailure = () => ({
  type: _constants.DATA.ADD_DATA_FAILURE
});

exports.addDataFailure = addDataFailure;

const updateReactiveList = () => ({
  type: _constants.DATA.UPDATE_REACTIVE_LIST
});

exports.updateReactiveList = updateReactiveList;