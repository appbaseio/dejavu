// @flow

import React from 'react';
import { DatePicker } from 'antd';
import moment from 'dayjs';

import CellStyled from './Cell.styles';
import { getDateFormat } from '../../utils';
import { MODES } from '../../constants';

type Props = {
	children: any,
	onChange: string => void,
	format?: string,
	mode: string,
};

const DateCell = ({ children, onChange, format, mode }: Props) => (
	<CellStyled>
		{mode === MODES.EDIT ? (
			<DatePicker
				showTime
				defaultValue={
					children ? moment(children, getDateFormat(format)) : null
				}
				format={getDateFormat(format)}
				css={{
					minWidth: '100% !important',
					input: {
						paddingRight: '30px !important',
					},
				}}
				onChange={(momentObject, dateString) => {
					onChange(dateString || null);
				}}
			/>
		) : (
			children &&
			moment(children, getDateFormat(format)).format(
				getDateFormat(format),
			)
		)}
	</CellStyled>
);

export default DateCell;
