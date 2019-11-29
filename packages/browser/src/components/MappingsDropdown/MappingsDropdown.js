// @flow

import React from 'react';
import { object } from 'prop-types';
import { Popover } from 'antd';

import JsonView from '../JsonView';
import MappingsIcon from '../MappingsIcon';
import popoverContent from '../CommonStyles/popoverContent';

type Props = {
	mapping: object,
};

const MappingsDropdown = ({ mapping }: Props) => (
	<Popover
		content={
			<div css={popoverContent}>
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
