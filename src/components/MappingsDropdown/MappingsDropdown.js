import React from 'react';
import { object } from 'prop-types';

import JsonView from '../JsonView';

const MappingsDropdown = ({ mapping }) => (
	<div
		css={{
			background: '#fff',
			borderRadius: 4,
			padding: 10,
			boxShadow: '0 1px 6px rgba(0, 0, 0, .2)',
		}}
	>
		<JsonView json={mapping} />
	</div>
);

MappingsDropdown.propTypes = {
	mapping: object.isRequired,
};

export default MappingsDropdown;
