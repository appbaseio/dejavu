"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _redux = require("redux");

var _reduxSaga = _interopRequireDefault(require("redux-saga"));

var _reduxThunk = _interopRequireDefault(require("redux-thunk"));

var _reducers = _interopRequireDefault(require("../reducers"));

var _sagas = _interopRequireDefault(require("../sagas"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const configureStore = () => {
  const sagaMiddleware = (0, _reduxSaga.default)();

  const middlewares = _redux.applyMiddleware.apply(void 0, [sagaMiddleware, _reduxThunk.default]);

  const store = (0, _redux.createStore)(_reducers.default, window.__REDUX_DEVTOOLS_EXTENSION__ ? (0, _redux.compose)(middlewares, window.__REDUX_DEVTOOLS_EXTENSION__()) : middlewares);
  sagaMiddleware.run(_sagas.default);
  return store;
};

var _default = configureStore;
exports.default = _default;