import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { ConfigProvider } from 'antd';
import DataBrowserContainer from './components/DataBrowserContainer/DataBrowserContainer';
import configureStore from './store';

// shared components
import DefaultFlex from './components/Flex';
import DefaultFlashMessage from './components/ErrorFlashMessage/FlashMessage';
import DefaultConnectApp from './components/ConnectApp/ConnectApp';

// shared reducers
import * as appReducers from './reducers/app';
import * as mappingsReducers from './reducers/mappings';

// shared utils
import * as utils from './utils';

// shared constants
import * as constants from './constants';

// shared theme
import colors from './components/theme/colors';

// shared store
const store = configureStore();

function WithConfigProvider(props) {
	return (
		<ConfigProvider>
			{/* eslint-disable-next-line react/prop-types */}
			{props.children}
		</ConfigProvider>
	);
}

const Flex = props => (
	<WithConfigProvider>
		<DefaultFlex {...props} />
	</WithConfigProvider>
);

const FlashMessage = props => (
	<WithConfigProvider>
		<DefaultFlashMessage {...props} />
	</WithConfigProvider>
);

const ConnectApp = props => (
	<WithConfigProvider>
		<DefaultConnectApp {...props} />
	</WithConfigProvider>
);

const DataBrowserWrapper = props => (
	<WithConfigProvider>
		<Provider store={store}>
			<BrowserRouter>
				<section>
					<DefaultFlashMessage />
					<DefaultConnectApp {...props} />
					<DataBrowserContainer
						// eslint-disable-next-line react/prop-types
						enableReactivesearch={props.enableReactivesearch}
						// eslint-disable-next-line react/prop-types
						hasCloneApp={props.hasCloneApp}
					/>
				</section>
			</BrowserRouter>
		</Provider>
	</WithConfigProvider>
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
