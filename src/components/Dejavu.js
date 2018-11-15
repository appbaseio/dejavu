import React from 'react';

import ConnectApp from './ConnectApp';
import DataBrowserContainer from './DataBrowserContainer';
import ErrorFlashMessage from './ErrorFlashMessage';

const Dejavu = () => (
	<section css={{ marginRight: '25px' }}>
		<ErrorFlashMessage />
		<ConnectApp />
		<DataBrowserContainer />
	</section>
);

export default Dejavu;
