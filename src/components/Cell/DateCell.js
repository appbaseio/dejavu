// @flow

import React from 'react';
import { DatePicker } from 'antd';
import { func, number, string, any } from 'prop-types';
import moment from 'moment';

import CellStyled from './Cell.styles';
import { getDateFormat } from '../../utils';

type Props = {
	children: any,
	onChange: (number, string, any) => void,
	onClick: (any, any) => void,
	format?: string,
	row: number,
	column: string,
	mode: string,
};

const DateCell = ({
	children,
	onChange,
	onClick,
	row,
	column,
	format,
	mode,
}: Props) => (
	<CellStyled
		onFocus={() => onClick(row, column)}
		onBlur={() => {
			onClick(null, null);
		}}
	>
		{mode === 'edit' ? (
			<DatePicker
				showTime
				defaultValue={
					children && moment(children, getDateFormat(format))
				}
				format={getDateFormat(format)}
				css={{
					width: '100% !important',
					height: '100%',
					input: { borderColor: 'transparent' },
				}}
				onChange={(momentObject, dateString) => {
					if (children !== dateString) {
						// only update value if date string has changed
						onChange(row, column, dateString || null);
					}
				}}
			/>
		) : (
			children && moment(children).format(getDateFormat(format))
		)}
	</CellStyled>
);

DateCell.propTypes = {
	row: number.isRequired,
	column: string.isRequired,
	onChange: func.isRequired,
	children: any,
	format: string,
	onClick: func.isRequired,
	mode: string,
};

export default DateCell;
