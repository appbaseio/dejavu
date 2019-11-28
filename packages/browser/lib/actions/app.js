"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setHeaders = exports.connectAppFailure = exports.connectAppSuccess = exports.disconnectApp = exports.connectApp = void 0;

var _constants = require("./constants");

const connectApp = (appname, url) => ({
  type: _constants.APP.CONNECT_REQUEST,
  appname,
  url
});

exports.connectApp = connectApp;

const connectAppSuccess = (appname, url) => ({
  type: _constants.APP.CONNECT_SUCCESS,
  appname,
  url
});

exports.connectAppSuccess = connectAppSuccess;

const connectAppFailure = () => ({
  type: _constants.APP.CONNECT_FAILURE
});

exports.connectAppFailure = connectAppFailure;

const disconnectApp = () => ({
  type: _constants.APP.DISCONNECT
});

exports.disconnectApp = disconnectApp;

const setHeaders = headers => ({
  type: _constants.APP.SET_HEADERS,
  headers
});

exports.setHeaders = setHeaders;