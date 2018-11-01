// @flow

import React from 'react';
import { DatePicker } from 'antd';
import { func, string, any } from 'prop-types';
import moment from 'moment';

import CellStyled from './Cell.styles';
import { getDateFormat } from '../../utils';

type Props = {
	children: any,
	onChange: func,
	format?: string,
	mode: string,
};

const DateCell = ({ children, onChange, format, mode }: Props) => (
	<CellStyled>
		{mode === 'edit' ? (
			<DatePicker
				showTime
				defaultValue={
					children ? moment(children, getDateFormat(format)) : null
				}
				format={getDateFormat(format)}
				css={{
					width: '100% !important',
					height: '100%',
				}}
				onChange={(momentObject, dateString) => {
					if (children !== dateString) {
						// only update value if date string has changed
						onChange(dateString || null);
					}
				}}
			/>
		) : (
			children && moment(children).format(getDateFormat(format))
		)}
	</CellStyled>
);

DateCell.propTypes = {
	onChange: func.isRequired,
	children: any,
	format: string,
	mode: string,
};

export default DateCell;
