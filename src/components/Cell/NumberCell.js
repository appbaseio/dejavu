// @flow

import React, { Component } from 'react';
import { InputNumber } from 'antd';
import { func, any, bool } from 'prop-types';

import CellStyled from './Cell.styles';

type Props = {
	children: any,
	onChange: func,
	active: boolean,
};

type State = {
	value: any,
};
class NumberCell extends Component<Props, State> {
	state = {
		value: this.props.children,
	};

	handleChange = (nextValue: any) => {
		this.setState(({ value }) => {
			if (
				typeof nextValue === 'number' ||
				nextValue === '' ||
				nextValue === '-'
			) {
				return { value: nextValue };
			}
			return { value };
		});
	};

	saveChange = () => {
		const { onChange, children } = this.props;
		const { value } = this.state;
		if (value !== children) {
			// only save value if it has changed
			let nextValue = value;
			if (value === '' || value === '-') {
				nextValue = 0;
				this.setState({ value: nextValue });
			}

			onChange(nextValue);
		}
	};

	render() {
		const { children, active } = this.props;
		const { value } = this.state;
		return (
			<CellStyled tabIndex="0" role="Gridcell">
				{active ? (
					<div
						css={{
							width: '100%',
							height: '100%',
						}}
					>
						<InputNumber
							autoFocus
							value={value}
							onChange={this.handleChange}
							css={{
								width: '100%',
								height: '100%',
							}}
						/>
					</div>
				) : (
					children
				)}
			</CellStyled>
		);
	}
}

NumberCell.propTypes = {
	onChange: func.isRequired,
	children: any,
	active: bool,
};

export default NumberCell;
