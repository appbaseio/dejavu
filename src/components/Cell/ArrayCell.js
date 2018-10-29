// @flow

import React, { Fragment } from 'react';
import { Select, Popover, Button } from 'antd';
import { func, number, string, any } from 'prop-types';

import JsonView from '../JsonView';

type Props = {
	children: [],
	onChange: (number, string, any) => void,
	row: number,
	column: string,
	mode: string,
};

const { Option } = Select;

const ArrayCell = ({ children, onChange, row, column, mode }: Props) => (
	<Fragment>
		{mode === 'edit' ? (
			<Select
				value={children}
				css={{
					width: '200px',
					height: '100%',
					'.ant-select-selection': {
						borderColor: 'transparent',
					},
					'.ant-select-selection__choice': {
						height: '32px !important',
						paddingTop: 4,
					},
				}}
				mode="multiple"
				showSearch={false}
				maxTagCount={0}
				onChange={value => onChange(row, column, value)}
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
					<Button shape="circle" icon="ellipsis" />
				</Popover>
			)
		)}
	</Fragment>
);

ArrayCell.propTypes = {
	row: number.isRequired,
	column: string.isRequired,
	onChange: func.isRequired,
	children: any,
	mode: string,
};

export default ArrayCell;
