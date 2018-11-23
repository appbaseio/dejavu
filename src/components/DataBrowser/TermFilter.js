// @flow

import React from 'react';
import { Popover } from 'antd';
import { MultiList } from '@appbaseio/reactivesearch';
import { css } from 'react-emotion';

import filterIconStyles from '../CommonStyles/filterIcons';

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
						borderColor: '#1890ff !important',
					},
					'.ant-checkbox-input + label::before': {
						borderRadius: '3px',
						color: '#1890ff !important',
					},
					'.ant-checkbox-input:hover + label::before': {
						borderColor: '#1890ff !important',
					},
				}}
				innerClass={{
					input: `ant-input ${css`
						height: 32px;
						background: #fff !important;
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
