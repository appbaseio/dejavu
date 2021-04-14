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
	column: string,
	row: string,
};

const Cell = ({ mapping, column, row, ...props }: Props) => {
	if (mapping && (mapping.type || mapping.properties)) {
		switch (mapping.type) {
			case 'boolean':
				return <BooleanCell {...props} key={`${column}-${row}`} />;
			case 'integer':
			case 'float':
			case 'long':
			case 'double':
				if (Array.isArray(props.children)) {
					return (
						<ArrayCell
							{...props}
							mappingType={mapping.type}
							key={`${column}-${row}`}
						/>
					);
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
				return <ObjectCell {...props} key={`${column}-${row}`} />;
			case 'string':
			case 'text':
			case 'keyword':
				if (Array.isArray(props.children) && props) {
					return (
						<ArrayCell
							{...props}
							mappingType={mapping.type}
							key={`${column}-${row}`}
						/>
					);
				}
				if (isObject(mapping.properties)) {
					return <ObjectCell {...props} key={`${column}-${row}`} />;
				}
				return <TextCell {...props} key={`${column}-${row}`} />;
			default:
				return <ObjectCell {...props} key={`${column}-${row}`} />;
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
