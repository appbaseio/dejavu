import React from 'react';
import { DatePicker } from 'antd';
import { func, number, string, any, bool } from 'prop-types';
import moment from 'moment';

import CellStyled from './Cell.styles';
import { getDateFormat } from '../../utils';

const DateCell = ({
	children,
	onChange,
	onFocus,
	row,
	column,
	format,
	active,
}) => (
	<CellStyled
		onFocus={() => onFocus(row, column)}
		onBlur={() => {
			onFocus(null, null);
		}}
	>
		{active ? (
			<DatePicker
				showTime
				defaultValue={
					children && moment(children, getDateFormat(format))
				}
				format={getDateFormat(format)}
				css={{
					width: '100% !important',
					height: '100%',
					input: { height: 42, borderColor: 'transparent' },
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
	onFocus: func.isRequired,
	active: bool,
};

export default DateCell;
