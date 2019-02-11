import React from 'react';

import { getUrlParams } from '../../utils';
import UpdateQueryRule from './UpdateQueryRule';

const QueryInfo = () => {
	const { searchTerm } = getUrlParams(window.location.search);
	return (
		<div
			css={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
			}}
		>
			<h3 css={{ margin: '25px 0 0' }}>
				{`Showing results for "${searchTerm}"`}
			</h3>
			<UpdateQueryRule />
		</div>
	);
};

export default QueryInfo;
