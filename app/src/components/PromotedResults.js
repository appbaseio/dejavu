import React from 'react';

import ConnectApp from './ConnectApp';
import DataBrowserContainer from './DataBrowserContainer';
import ErrorFlashMessage from './ErrorFlashMessage';

const Dejavu = () => (
	<section>
		<ErrorFlashMessage />
		<ConnectApp />
		<DataBrowserContainer searchTerm="harry" />
	</section>
);

export default Dejavu;
