import React, { Fragment } from 'react';
import { Select } from 'antd';
import { func, number, string, any } from 'prop-types';

const { Option } = Select;

const ArrayCell = ({ children, onChange, row, column, mode }) => (
	<Fragment>
		{mode === 'edit' ? (
			<Select
				value={children}
				css={{
					width: '230px',
					height: '100%',
					'.ant-select-selection': {
						borderColor: 'transparent',
					},
					'.ant-select-selection__choice': {
						height: '32px !important',
						paddingTop: 4,
					},
				}}
				mode="multiple"
				showSearch={false}
				maxTagCount={0}
				onChange={value => onChange(row, column, value)}
				notFoundContent=""
			>
				{children.map(child => (
					<Option key={child}>{child}</Option>
				))}
			</Select>
		) : (
			children && `${children.length} Items`
		)}
	</Fragment>
);

ArrayCell.propTypes = {
	row: number.isRequired,
	column: string.isRequired,
	onChange: func.isRequired,
	children: any,
	mode: string,
};

export default ArrayCell;
