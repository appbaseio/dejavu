import React from 'react';

import ConnectApp from './ConnectApp';
import DataBrowserContainer from './DataBrowserContainer';
import ErrorFlashMessage from './ErrorFlashMessage';
import { getUrlParams } from '../utils';

const Dejavu = () => {
	const { searchTerm } = getUrlParams(window.location.search);
	return (
		<section>
			<ErrorFlashMessage />
			<ConnectApp />
			<DataBrowserContainer searchTerm={searchTerm} />
		</section>
	);
};

export default Dejavu;
