import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import ConnectApp from '@dejavu-monorepo/browser';

function App(props) {
  console.log({ props });
  return (
    <Router>
      <div>
        <Route exact path="/" component={ConnectApp} />
      </div>
    </Router>
  );
}

export default App;
