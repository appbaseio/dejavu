import React from 'react';
import ConnectApp from './components/ConnectApp/ConnectApp';
import configureStore from './store';
import { Provider } from 'react-redux';

const store = configureStore();

const ConnectAppWithRedux = props => (
  <Provider store={store}>
    <ConnectApp {...props} />
  </Provider>
);

export default ConnectAppWithRedux;
