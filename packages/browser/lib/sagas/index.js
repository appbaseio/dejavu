"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rootSaga;

var _effects = require("redux-saga/effects");

var _app = _interopRequireDefault(require("./app"));

var _mappings = _interopRequireDefault(require("./mappings"));

var _cell = _interopRequireDefault(require("./cell"));

var _data = _interopRequireDefault(require("./data"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function* rootSaga() {
  yield (0, _effects.all)([(0, _app.default)(), (0, _mappings.default)(), (0, _cell.default)(), (0, _data.default)()]);
}