// @flow

import React, { Component, Fragment } from 'react';
import { Select, Popover } from 'antd';
import { func, string, any } from 'prop-types';

import { MODES } from '../../constants';
import JsonView from '../JsonView';

import popoverContent from '../CommonStyles/popoverContent';
import { NUMERIC_DATATYPES } from '../../utils/mappings';

type Props = {
	children: [],
	onChange: func,
	mode: string,
	mappingType: string,
};

type State = {
	data: any,
};

const { Option } = Select;

const parseData = (value = [], dataType) => {
	if (NUMERIC_DATATYPES.includes(dataType))
		return value.map(val => Number(val));
	return value;
};

class ArrayCell extends Component<Props, State> {
	state = {
		data: this.props.children || [],
	};

	handleChange = (value: any) => {
		const { mappingType } = this.props;
		this.setState({ data: value });
		this.props.onChange(parseData(value, mappingType));
	};

	render() {
		const { data } = this.state;
		const { mode } = this.props;

		return (
			<Fragment>
				{mode === MODES.EDIT ? (
					<Select
						value={data.map(item => item.toString())}
						css={{
							width: '100%',
							height: '100%',
							display: 'flex',
							justifyContent: 'left',
							alignItems: 'center',
							'.dejavu-browser-select-selection': {
								borderColor: 'transparent',
								height: '100%',
								width: '100%',
							},
							'.dejavu-browser-select-selection__choice': {
								height: '100%',
							},
							'.dejavu-browser-select': {
								width: '100%',
							},
						}}
						mode="tags"
						maxTagCount={0}
						onChange={value => this.handleChange(value)}
						notFoundContent=""
					>
						{data.map(
							child =>
								child && (
									<Option key={child.toString()}>
										{child}
									</Option>
								),
						)}
					</Select>
				) : (
					Boolean(data.length) && (
						<Popover
							content={
								<div css={popoverContent}>
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
	mappingType: string,
};

export default ArrayCell;
