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

// shared constants
import * as constants from './constants';

// shared store
const store = configureStore();

// shared theme
import colors from './components/theme/colors';

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
  Flex,
  FlashMessage,
  ConnectApp,
  appReducers,
  mappingsReducers,
  utils,
  store,
  constants,
  colors,
};

// main data browser module
export default DataBrowserWrapper;
