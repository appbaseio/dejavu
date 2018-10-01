import React from 'react';
import { node, func, number, string, bool } from 'prop-types';
import { Input } from 'antd';

const { TextArea } = Input;

const Cell = ({ active, children, onFocus, row, column }) => (
	<div
		onFocus={() => onFocus(row, column)}
		onBlur={() => onFocus(null, null)}
		tabIndex="0"
		role="Gridcell"
		css={{
			width: 250,
			height: '100%',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
			padding: active ? 0 : 10,
			outline: 'none',
		}}
	>
		{active ? <TextArea autoFocus autosize value={children} /> : children}
	</div>
);

Cell.propTypes = {
	children: node,
	onFocus: func.isRequired,
	row: number.isRequired,
	column: string.isRequired,
	active: bool.isRequired,
};

export default Cell;
