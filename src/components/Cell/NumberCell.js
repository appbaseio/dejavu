// @flow

import React, { Component, Fragment } from 'react';
import { Input } from 'antd';
import { func, any, bool } from 'prop-types';

import CellStyled from './Cell.styles';

type Props = {
	children: any,
	onChange: func,
	mode?: string,
	editable?: boolean,
	shouldAutoFocus?: boolean,
};

type State = {
	value: any,
};
class NumberCell extends Component<Props, State> {
	state = {
		value: this.props.children,
	};

	// $FlowFixMe
	handleChange = e => {
		const {
			target: { value: nextValue },
		} = e;
		this.setState(({ value }) => {
			// eslint-disable-next-line
			if (!isNaN(nextValue)) {
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

			onChange(Number(nextValue));
		}
	};

	render() {
		const { children, mode, editable, shouldAutoFocus } = this.props;
		const { value } = this.state;
		return (
			<Fragment>
				{editable || mode === 'edit' ? (
					<Input
						tabIndex="0"
						role="Gridcell"
						value={value}
						onChange={this.handleChange}
						css={{
							height: '100% important',
							width: '100%',
							border: `${shouldAutoFocus ? 'none' : 'auto'}`,
						}}
						onBlur={this.saveChange}
					/>
				) : (
					<CellStyled>{children}</CellStyled>
				)}
			</Fragment>
		);
	}
}

NumberCell.propTypes = {
	onChange: func.isRequired,
	children: any,
	shouldAutoFocus: bool,
};

export default NumberCell;
