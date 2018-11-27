// @flow

import React from 'react';
import { Popover } from 'antd';
import { MultiList } from '@appbaseio/reactivesearch';
import { css } from 'react-emotion';

import Flex from '../Flex';

import filterIconStyles from '../CommonStyles/filterIcons';
import overflowStyles from '../CommonStyles/overflowText';
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
					maxWidth: 200,
					'.ant-checkbox-input:checked + label::before': {
						borderColor: `${colors.primary} !important`,
					},
					'.ant-checkbox-input:checked + label::after': {
						left: 'calc(1px + 12px/5) !important',
						width: 'calc(12px / 2) !important',
						height: 'calc(12px / 5) !important',
						marginTop: 'calc(12px / -2 / 2 * 0.8) !important',
						top: '14px !important',
					},
					'.ant-checkbox-input + label::before': {
						borderRadius: '3px',
						color: `${colors.primary} !important`,
						borderWidth: '1px !important',
						height: '12px !important',
						width: '12px !important',
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
				renderListItem={(label, count) => (
					<Flex
						alignItem="center"
						wrap="nowrap"
						justifyContent="space-between"
						css={{
							width: '100%',
						}}
					>
						<span
							css={{ maxWidth: 100 }}
							className={overflowStyles}
						>
							{label}
						</span>
						<span>({count})</span>
					</Flex>
				)}
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
