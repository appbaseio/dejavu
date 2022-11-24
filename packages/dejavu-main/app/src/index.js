import React from 'react';
import ReactDOM from 'react-dom';
import { CrossStorageHub } from 'cross-storage';

import App from './App';
import 'antd/dist/antd.css';

CrossStorageHub.init([
	{ origin: /\.appbase.io$/, allow: ['get'] },
	{ origin: /localhost:1359$/, allow: ['get'] },
	{ origin: /localhost:1358$/, allow: ['get'] },
]);

ReactDOM.render(<App />, document.getElementById('root'));
