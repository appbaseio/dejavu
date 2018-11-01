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
					typeof children === 'undefined' ? 'false' : String(children)
				}
				css={{ width: '100% !important' }}
				onChange={value => {
					onChange(Boolean(value));
				}}
			>
				<Option value="true">true</Option>
				<Option value="false">false</Option>
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
