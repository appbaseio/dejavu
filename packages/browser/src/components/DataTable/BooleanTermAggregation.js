// @flow

import React from 'react';
import { Popover } from 'antd';
import { MultiDataList } from '@appbaseio/reactivesearch';
import { css } from 'react-emotion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

import Flex from '../Flex';

import filterIconStyles from '../CommonStyles/filterIcons';
import overflowStyles from '../CommonStyles/overflowText';
import colors from '../theme/colors';
import termAggregationStyles from '../CommonStyles/termAggregations';

type Props = {
	field: string,
};

const BooleanTermAggregation = ({ field }: Props) => {
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
				<MultiDataList
					componentId={componentId}
					dataField={field}
					size={100}
					css={termAggregationStyles}
					data={[
						{
							label: 'true',
							value: true,
						},
						{
							label: 'false',
							value: false,
						},
					]}
					innerClass={{
						input: `ant-input ${css`
							height: 32px;
							background: ${colors.white} !important;
						`}`,
						checkbox: 'ant-checkbox-input',
					}}
					renderItem={label => (
						<Flex
							alignItem="center"
							wrap="nowrap"
							justifyContent="space-between"
							css={{
								width: '100%',
							}}
							key={label}
						>
							<span
								css={{ maxWidth: 100 }}
								className={overflowStyles}
							>
								{label}
							</span>
						</Flex>
					)}
				/>
			}
			title="Filter"
			trigger="click"
			placement="bottomRight"
		>
			<FontAwesomeIcon icon={faFilter} className={filterIconStyles} />
		</Popover>
	);
};

export default BooleanTermAggregation;
