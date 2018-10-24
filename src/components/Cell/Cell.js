import React from 'react';
import { func, number, string, bool, any } from 'prop-types';

import { isObject } from '../../utils';
import { dateFormatMap } from '../../utils/date';

import BooleanCell from './BooleanCell';
import TextCell from './TextCell';
import NumberCell from './NumberCell';
import ArrayCell from './ArrayCell';
import DateCell from './DateCell';
import ObjectCell from './ObjectCell';

const Cell = ({ mapping, ...props }) => {
	switch (mapping.type) {
		case 'boolean':
			return <BooleanCell {...props} />;
		case 'integer':
		case 'long':
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
		default:
			if (Array.isArray(props.children)) {
				return <ArrayCell {...props} />;
			}
			if (isObject(mapping.properties)) {
				return <ObjectCell {...props} />;
			}
			return <TextCell {...props} />;
	}
};

Cell.propTypes = {
	children: any,
	onFocus: func.isRequired,
	row: number.isRequired,
	column: string.isRequired,
	active: bool.isRequired,
	onChange: func.isRequired,
};

export default Cell;
