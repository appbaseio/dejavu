import React from 'react';
import { Select } from 'antd';
import { func, number, string, any } from 'prop-types';

const { Option } = Select;

const ArrayCell = ({ children, onChange, row, column }) => (
	// options can be fetched by doing aggregations on the field
	<Select
		value={children}
		css={{
			width: '100%',
			height: '100%',
			'.ant-select-selection': {
				borderColor: 'transparent',
			},
			'.ant-select-selection__choice': {
				height: '32px !important',
				paddingTop: 4,
			},
		}}
		mode="tags"
		maxTagCount={1}
		onChange={value => onChange(row, column, value)}
	>
		{children.map(child => (
			<Option key={child}>{child}</Option>
		))}
	</Select>
);

ArrayCell.propTypes = {
	row: number.isRequired,
	column: string.isRequired,
	onChange: func.isRequired,
	children: any,
};

export default ArrayCell;
