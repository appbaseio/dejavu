// @flow

import React from 'react';
import { Select } from 'antd';
import { func, string, any } from 'prop-types';

import CellStyled from './Cell.styles';

const { Option } = Select;

type Props = {
	children: boolean,
	onChange: func,
	mode: string,
};

const BooleanCell = ({ children, onChange, mode }: Props) => (
	<CellStyled>
		{mode === 'edit' ? (
			<Select
				defaultValue={
					children !== undefined ||
					children !== null ||
					children !== ''
						? String(children)
						: ''
				}
				style={{ width: '100%' }}
				onChange={value => {
					onChange(Boolean(value));
				}}
			>
				<Option value="">Select Option</Option>
				<Option value="true">True</Option>
				<Option value="false">False</Option>
			</Select>
		) : (
			children
		)}
	</CellStyled>
);

BooleanCell.propTypes = {
	onChange: func.isRequired,
	children: any,
	mode: string,
};

export default BooleanCell;
