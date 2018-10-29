// @flow

import React from 'react';
import { object } from 'prop-types';
import { Icon } from 'antd';
import Hash from 'react-feather/dist/icons/hash';
import Toggle from 'react-feather/dist/icons/toggle-right';

type Props = {
	mapping: object,
};

const MappingsIcon = ({ mapping, ...props }: Props) => {
	const { type } = mapping;
	switch (type) {
		case 'text':
		case 'keyword':
		case 'string':
			return <Icon type="message" {...props} />;
		case 'integer':
		case 'long':
			return <Hash size={14} {...props} />;
		case 'geo_point':
		case 'geo_shape':
			return <Icon type="environment" {...props} />;
		case 'boolean':
			return <Toggle size={14} {...props} />;
		case 'date':
			return <Icon type="calendar" {...props} />;
		case 'float':
		case 'double':
			return <Icon type="pie-chart" {...props} />;
		default:
			return <Icon type="tags" {...props} />;
	}
};

export default MappingsIcon;
