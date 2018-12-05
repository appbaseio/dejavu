import React from 'react';
import ReactDOM from 'react-dom';
import { CrossStorageHub } from 'cross-storage';

import App from './App';

CrossStorageHub.init([
	{ origin: /\.appbase.io$/, allow: ['get'] },
	{ origin: /hardcore-hoover-0d4fea.netlify.com$/, allow: ['get'] },
	{ origin: /localhost:1359$/, allow: ['get'] },
]);

ReactDOM.render(<App />, document.getElementById('root'));
