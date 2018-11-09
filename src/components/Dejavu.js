import React from 'react';

import ConnectApp from './ConnectApp';
import DataBrowserContainer from './DataBrowserContainer';
import ErrorFlashMessage from './ErrorFlashMessage';

const Dejavu = () => (
	<section css={{ marginRight: '25px', height: '83vh' }}>
		<ErrorFlashMessage />
		<ConnectApp />
		<DataBrowserContainer />
	</section>
);

export default Dejavu;
