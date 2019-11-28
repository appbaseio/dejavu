import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import ConnectApp from './components/ConnectApp/ConnectApp';
import FlashMessage from './components/ErrorFlashMessage/FlashMessage';
import DataBrowserContainer from './components/DataBrowserContainer/DataBrowserContainer';
import configureStore from './store';

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

export default DataBrowserWrapper;
