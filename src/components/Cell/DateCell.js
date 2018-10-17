import React from 'react';
import { DatePicker } from 'antd';
import { func, number, string, any } from 'prop-types';

import CellStyled from './Cell.styles';
import { getDateFormat } from '../../utils';

const moment = require('moment');

const DateCell = ({ children, onChange, onFocus, row, column, format }) => (
	<CellStyled
		onFocus={() => onFocus(row, column)}
		onBlur={() => {
			onFocus(null, null);
		}}
	>
		<DatePicker
			showTime
			defaultValue={moment(children, getDateFormat(format))}
			format={getDateFormat(format)}
			css={{
				width: '100% !important',
				height: '100%',
				input: { height: 42, borderColor: 'transparent' },
			}}
			onChange={(momentObject, dateString) => {
				if (children !== dateString) {
					// only update value if date string has changed
					onChange(row, column, dateString);
				}
			}}
		/>
	</CellStyled>
);

DateCell.propTypes = {
	row: number.isRequired,
	column: string.isRequired,
	onChange: func.isRequired,
	children: any,
	format: string,
	onFocus: func.isRequired,
};

export default DateCell;
