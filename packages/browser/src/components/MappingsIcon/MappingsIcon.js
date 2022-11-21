// @flow

import React from 'react';
import { object } from 'prop-types';
import {
	MessageOutlined,
	EnvironmentOutlined,
	CalendarOutlined,
} from '@ant-design/icons';
import Hash from '../Icons/Hash';
import Toggle from '../Icons/Toggle';

type Props = {
	mapping: object,
};

const MappingsIcon = ({ mapping, ...props }: Props) => {
	const { type } = mapping;
	switch (type) {
		case 'text':
		case 'keyword':
		case 'string':
			return <MessageOutlined {...props} />;
		case 'integer':
		case 'long':
			return <Hash size={14} {...props} />;
		case 'geo_point':
		case 'geo_shape':
			return <EnvironmentOutlined {...props} />;
		case 'boolean':
			return <Toggle size={14} {...props} />;
		case 'date':
			return <CalendarOutlined {...props} />;
		case 'float':
		case 'double':
			return (
				<span css={{ cursor: 'pointer' }} {...props}>
					π
				</span>
			);
		default:
			return (
				<span css={{ cursor: 'pointer' }} {...props}>{`{...}`}</span>
			);
	}
};

export default MappingsIcon;
