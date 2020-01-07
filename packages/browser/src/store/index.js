import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';
import rootSaga from '../sagas';

const configureStore = () => {
	const sagaMiddleware = createSagaMiddleware();
	const middlewares = applyMiddleware(...[sagaMiddleware, thunk]);
	const store = createStore(
		rootReducer,
		window.__REDUX_DEVTOOLS_EXTENSION__
			? compose(middlewares, window.__REDUX_DEVTOOLS_EXTENSION__())
			: middlewares,
	);
	sagaMiddleware.run(rootSaga);
	return store;
};

export default configureStore;
