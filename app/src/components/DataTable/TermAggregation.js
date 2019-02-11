// @flow

import React from 'react';
import { Popover } from 'antd';
import { MultiList } from '@appbaseio/reactivesearch';
import { css } from 'react-emotion';

import Flex from '../Flex';

import filterIconStyles from '../CommonStyles/filterIcons';
import overflowStyles from '../CommonStyles/overflowText';
import termAggregationStyles from '../CommonStyles/termAggregations';
import colors from '../theme/colors';

type Props = {
	field: string,
};

const TermAggregation = ({ field }: Props) => {
	let componentId = field;
	if (field === '_type') {
		componentId = 'typeField';
	}

	if (field === '_index') {
		componentId = 'indexField';
	}
	return (
		<Popover
			content={
				<MultiList
					componentId={componentId}
					dataField={field}
					size={100}
					css={termAggregationStyles}
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
							<span>{count}</span>
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
};

export default TermAggregation;
