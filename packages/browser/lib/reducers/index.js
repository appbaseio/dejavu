"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

var _redux = require("redux");

var _constants = require("../actions/constants");

var _app = _interopRequireDefault(require("./app"));

var _mappings = _interopRequireDefault(require("./mappings"));

var _cell = _interopRequireDefault(require("./cell"));

var _data = _interopRequireDefault(require("./data"));

var _mode = _interopRequireDefault(require("./mode"));

var _error = _interopRequireDefault(require("./error"));

var _selectedRows = _interopRequireDefault(require("./selectedRows"));

var _updatingRow = _interopRequireDefault(require("./updatingRow"));

var _currentIds = _interopRequireDefault(require("./currentIds"));

var _sort = _interopRequireDefault(require("./sort"));

var _pageSize = _interopRequireDefault(require("./pageSize"));

var _nestedColumns = _interopRequireDefault(require("./nestedColumns"));

var _version = _interopRequireDefault(require("./version"));

var _query = _interopRequireDefault(require("./query"));

var _applyQuery = _interopRequireDefault(require("./applyQuery"));

var _selectAll = _interopRequireDefault(require("./selectAll"));

var _stats = _interopRequireDefault(require("./stats"));

var _analyzers = _interopRequireDefault(require("./analyzers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const appReducer = (0, _redux.combineReducers)({
  app: _app.default,
  mappings: _mappings.default,
  cell: _cell.default,
  data: _data.default,
  mode: _mode.default,
  error: _error.default,
  selectedRows: _selectedRows.default,
  updatingRow: _updatingRow.default,
  currentIds: _currentIds.default,
  sort: _sort.default,
  pageSize: _pageSize.default,
  nestedColumns: _nestedColumns.default,
  version: _version.default,
  query: _query.default,
  applyQuery: _applyQuery.default,
  selectAll: _selectAll.default,
  stats: _stats.default,
  analyzers: _analyzers.default
});
const initialState = appReducer({}, {});

const rootReducer = (state, action) => {
  let newState = _objectSpread({}, state);

  if (action.type === _constants.APP.DISCONNECT) {
    newState = _objectSpread({}, initialState);
  }

  return appReducer(newState, action);
};

var _default = rootReducer;
exports.default = _default;