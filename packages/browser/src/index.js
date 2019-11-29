import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import DataBrowserContainer from './components/DataBrowserContainer/DataBrowserContainer';
import configureStore from './store';

// shared components
import Flex from './components/Flex';
import FlashMessage from './components/ErrorFlashMessage/FlashMessage';
import ConnectApp from './components/ConnectApp/ConnectApp';

// shared reducers
import * as appReducers from './reducers/app';
import * as mappingsReducers from './reducers/mappings';

// shared utils
import * as utils from './utils';

const store = configureStore();

const DataBrowserWrapper = () => (
  <Provider store={store}>
    <BrowserRouter>
      <section>
        <FlashMessage />
        <ConnectApp />
        <DataBrowserContainer />
      </section>
    </BrowserRouter>
  </Provider>
);

export {
  DataBrowserWrapper,
  Flex,
  FlashMessage,
  ConnectApp,
  appReducers,
  mappingsReducers,
  utils,
  store,
};
