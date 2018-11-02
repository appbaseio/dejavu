// @flow

import React, { Component, Fragment } from 'react';
import { Select, Popover } from 'antd';
import { func, string, any } from 'prop-types';

import JsonView from '../JsonView';

type Props = {
	children: [],
	onChange: func,
	mode: string,
};

type State = {
	data: any,
};

const { Option } = Select;

class ArrayCell extends Component<Props, State> {
	state = {
		data: this.props.children || [],
	};

	handleChange = (value: any) => {
		this.setState({ data: value });
		this.props.onChange(value);
	};

	render() {
		const { data } = this.state;
		const { mode } = this.props;
		return (
			<Fragment>
				{mode === 'edit' ? (
					<Select
						value={data}
						css={{
							width: '100% !important',
							height: '100% !important',
							display: 'flex',
							justifyContent: 'left',
							alignItems: 'center',
							'.ant-select-selection': {
								borderColor: 'transparent !important',
								height: '100% !important',
								width: '100% !important',
							},
							'.ant-select-selection__choice': {
								height: '100% !important',
							},
							'.ant-select': {
								width: '100% !important',
							},
						}}
						mode="tags"
						maxTagCount={0}
						onChange={value => this.handleChange(value)}
						notFoundContent=""
					>
						{data.map(child => (
							<Option key={child}>{child}</Option>
						))}
					</Select>
				) : (
					Boolean(data.length) && (
						<Popover
							content={
								<div
									css={{
										maxWidth: '400px',
										maxHeight: '300px',
										overflow: 'auto',
									}}
								>
									<JsonView json={data} />
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
	}
}

ArrayCell.propTypes = {
	onChange: func.isRequired,
	children: any,
	mode: string,
};

export default ArrayCell;
