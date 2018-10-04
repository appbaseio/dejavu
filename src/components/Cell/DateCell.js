import React from 'react';
import { DatePicker } from 'antd';
import { func, number, string, any } from 'prop-types';

import { getDateFormat } from '../../utils';

const moment = require('moment');

const DateCell = ({ children, onChange, onFocus, row, column, format }) => (
	<div
		onFocus={() => onFocus(row, column)}
		onBlur={() => {
			onFocus(null, null);
		}}
		css={{
			width: 250,
			height: 42,
			outline: 'none',
			position: 'relative',
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
	</div>
);

DateCell.propTypes = {
	row: number.isRequired,
	column: string.isRequired,
	onChange: func.isRequired,
	children: any,
	format: string.isRequired,
	onFocus: func.isRequired,
};

export default DateCell;
