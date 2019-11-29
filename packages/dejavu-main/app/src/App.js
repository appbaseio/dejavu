import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import SearchPreview from './components/SearchPreview';
import { store } from 'dejavu-data-browser';

function App(props) {
  return (
    <div>
      <Provider store={store}>
        <BrowserRouter>
          <SearchPreview />
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
