// @flow

import React, { Fragment } from 'react';
import { Select, Popover } from 'antd';
import { func, string, any } from 'prop-types';

import JsonView from '../JsonView';

type Props = {
	children: [],
	onChange: func,
	mode: string,
};

const { Option } = Select;

const ArrayCell = ({ children, onChange, mode }: Props) => (
	<Fragment>
		{mode === 'edit' ? (
			<Select
				value={children}
				css={{
					width: '100% !important',
					height: '100% !important',
					display: 'flex',
					justifyContent: 'left',
					alignItems: 'center',
					'.ant-select-selection': {
						borderColor: 'transparent',
						height: '100% !important',
						width: '100% !important',
					},
					'.ant-select-selection__choice': {
						height: '100% !important',
					},
				}}
				mode="multiple"
				showSearch
				autoClearSearchValue
				maxTagCount={0}
				onChange={value => onChange(value)}
				notFoundContent=""
			>
				{children.map(child => (
					<Option key={child}>{child}</Option>
				))}
			</Select>
		) : (
			Boolean(children.length) && (
				<Popover
					content={
						<div
							css={{
								maxWidth: '400px',
								maxHeight: '300px',
								overflow: 'auto',
							}}
						>
							<JsonView json={children} />
						</div>
					}
					trigger="click"
				>
					<span css={{ cursor: 'pointer' }}> [...] </span>
				</Popover>
			)
		)}
	</Fragment>
);

ArrayCell.propTypes = {
	onChange: func.isRequired,
	children: any,
	mode: string,
};

export default ArrayCell;
