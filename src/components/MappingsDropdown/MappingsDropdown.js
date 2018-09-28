// @flow

import React from 'react';
import { object } from 'prop-types';

type Props = {
	mapping: object,
};

const MappingsDropdown = ({ mapping }: Props) => (
	<div
		css={{
			background: '#fff',
			borderRadius: 4,
			padding: 10,
			boxShadow: '0 1px 6px rgba(0, 0, 0, .2)',
		}}
	>
		<pre css={{ margin: 0 }}>{JSON.stringify(mapping, null, 2)}</pre>
	</div>
);

MappingsDropdown.propTypes = {
	mapping: object.isRequired,
};

export default MappingsDropdown;
