// @flow

import React from 'react';
import { Select } from 'antd';
import { func, string, any } from 'prop-types';

import CellStyled from './Cell.styles';
import { MODES } from '../../constants';

const { Option } = Select;

type Props = {
	children: boolean,
	onChange: func,
	mode: string,
};

const BooleanCell = ({ children, onChange, mode }: Props) => (
	<CellStyled>
		{mode === MODES.EDIT ? (
			<Select
				defaultValue={
					typeof children === 'undefined' ? 'false' : String(children)
				}
				css={{ width: '100%' }}
				onChange={value => {
					// convert string into boolean value
					onChange(value === 'true');
				}}
			>
				<Option value="true">true</Option>
				<Option value="false">false</Option>
			</Select>
		) : (
			children !== 'undefined' && <span>{String(children)}</span>
		)}
	</CellStyled>
);

BooleanCell.propTypes = {
	onChange: func.isRequired,
	children: any,
	mode: string,
};

export default BooleanCell;
