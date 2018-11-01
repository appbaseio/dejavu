import React from 'react';

import ConnectApp from './ConnectApp';
import DataBrowserContainer from './DataBrowserContainer';
import FlashMessage from './FlashMessage';

const Dejavu = () => (
	<section css={{ marginRight: '25px' }}>
		<FlashMessage />
		<ConnectApp />
		<DataBrowserContainer />
	</section>
);

export default Dejavu;
