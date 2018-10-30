// @flow

import React, { Component } from 'react';
import { InputNumber } from 'antd';
import { func, any, bool, object } from 'prop-types';

import CellStyled from './Cell.styles';

type Props = {
	children: any,
	onChange: func,
	active: boolean,
	handleFocus?: any => void,
	handleBlur?: any => void,
	shouldAutoFocus?: boolean,
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

	saveChange = (e: object) => {
		const { onChange, children, handleBlur } = this.props;
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

		if (handleBlur) {
			handleBlur(e);
		}
	};

	render() {
		const { children, active, handleFocus, shouldAutoFocus } = this.props;
		const { value } = this.state;
		return (
			<CellStyled tabIndex="0" role="Gridcell" onFocus={handleFocus}>
				{active ? (
					<div
						css={{
							width: '100%',
							height: '100%',
						}}
					>
						<InputNumber
							autoFocus={shouldAutoFocus}
							value={value}
							onChange={this.handleChange}
							css={{
								width: '100%',
								height: '100%',
							}}
							onBlur={this.saveChange}
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
	handleFocus: func,
	handleBlur: func,
	shouldAutoFocus: bool,
};

export default NumberCell;
