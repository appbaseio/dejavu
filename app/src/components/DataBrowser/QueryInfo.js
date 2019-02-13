import React from 'react';

import { getUrlParams } from '../../utils';
import UpdateQueryRule from './UpdateQueryRule';
import Container from './Container';

const QueryInfo = () => {
	const { searchTerm } = getUrlParams(window.location.search);
	return (
		<Container
			title={`Showing results for "${searchTerm}"`}
			button={<UpdateQueryRule />}
			icon="database"
			description="Promote results by clicking the star, hide them by clicking the eye. Click Manage to change active query."
		/>
	);
};

export default QueryInfo;
