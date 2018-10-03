import React from 'react';
import { func, number, string, bool, any } from 'prop-types';

import TextCell from './TextCell';

const Cell = ({ mapping, ...props }) => {
	switch (mapping.type) {
		case 'boolean':
			return <div>{props.children}</div>;
		default:
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
