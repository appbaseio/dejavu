// @flow

import React from 'react';
import { Popover } from 'antd';
import { MultiList } from '@appbaseio/reactivesearch';
import { css } from 'react-emotion';

import filterIconStyles from '../CommonStyles/filterIcons';
import colors from '../theme/colors';

type Props = {
	field: string,
};

const TermFilter = ({ field }: Props) => (
	<Popover
		content={
			<MultiList
				componentId={field}
				dataField={field}
				size={100}
				css={{
					'.ant-checkbox-input:checked + label::before': {
						borderColor: `${colors.primary} !important`,
					},
					'.ant-checkbox-input + label::before': {
						borderRadius: '3px',
						color: `${colors.primary} !important`,
					},
					'.ant-checkbox-input:hover + label::before': {
						borderColor: `${colors.primary} !important`,
					},
				}}
				innerClass={{
					input: `ant-input ${css`
						height: 32px;
						background: ${colors.white} !important;
					`}`,
					checkbox: 'ant-checkbox-input',
				}}
			/>
		}
		title="Filter"
		trigger="click"
		placement="bottomRight"
	>
		<i className={`fa fa-filter ${filterIconStyles}`} />
	</Popover>
);

export default TermFilter;
