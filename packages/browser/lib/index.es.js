"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _ConnectApp = _interopRequireDefault(require("./components/ConnectApp/ConnectApp"));

var _store = _interopRequireDefault(require("./store"));

var _reactRedux = require("react-redux");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const store = (0, _store.default)();

const ConnectAppWithRedux = props => _react.default.createElement(_reactRedux.Provider, {
  store: store
}, _react.default.createElement(_ConnectApp.default, props));

var _default = ConnectAppWithRedux;
exports.default = _default;
