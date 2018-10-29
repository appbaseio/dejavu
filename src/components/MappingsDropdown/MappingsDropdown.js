// @flow

import React from 'react';
import { object } from 'prop-types';
import { Popover } from 'antd';

import JsonView from '../JsonView';
import MappingsIcon from '../MappingsIcon';

type Props = {
	mapping: object,
};

const MappingsDropdown = ({ mapping }: Props) => (
	<Popover
		content={
			<div
				css={{
					maxHeight: '400px',
					maxWidth: '300px',
					overflow: 'auto',
				}}
			>
				<JsonView json={mapping} />
			</div>
		}
		trigger="click"
	>
		<MappingsIcon mapping={mapping} css={{ cursor: 'pointer' }} />
	</Popover>
);

MappingsDropdown.propTypes = {
	mapping: object.isRequired,
};

export default MappingsDropdown;
