// @flow

import React from 'react';
import { func, bool, any, object } from 'prop-types';

import { isObject } from '../../utils';
import { dateFormatMap } from '../../utils/date';

import BooleanCell from './BooleanCell';
import TextCell from './TextCell';
import NumberCell from './NumberCell';
import ArrayCell from './ArrayCell';
import DateCell from './DateCell';
import ObjectCell from './ObjectCell';

type Props = {
	mapping: object,
	children: any,
	active?: boolean,
	onChange: func,
	mode: string,
};

const Cell = ({ mapping, ...props }: Props) => {
	if (mapping && (mapping.type || mapping.properties)) {
		switch (mapping.type) {
			case 'boolean':
				return <BooleanCell {...props} />;
			case 'integer':
			case 'float':
			case 'long':
			case 'double':
				if (Array.isArray(props.children)) {
					return <ArrayCell {...props} />;
				}
				return <NumberCell {...props} />;
			case 'date':
				return (
					<DateCell
						{...props}
						format={mapping.format || dateFormatMap.date}
					/>
				);
			case 'object':
			case 'geo_point':
			case 'geo_shape':
				return <ObjectCell {...props} />;
			case 'string':
			case 'text':
				if (Array.isArray(props.children) && props) {
					return <ArrayCell {...props} />;
				}
				if (isObject(mapping.properties)) {
					return <ObjectCell {...props} />;
				}
				return <TextCell {...props} />;
			default:
				return <ObjectCell {...props} />;
		}
	} else {
		return null;
	}
};

Cell.propTypes = {
	children: any,
	active: bool,
	onChange: func.isRequired,
};

export default Cell;
