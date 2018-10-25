import React, { Component } from 'react';
import { InputNumber, Tooltip } from 'antd';
import { func, number, string, any, bool } from 'prop-types';

import CellStyled from './Cell.styles';

// stateful for validation
class NumberCell extends Component {
	state = {
		value: this.props.children,
	};

	handleChange = nextValue => {
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
		const { onClick, onChange, row, column, children } = this.props;
		const { value } = this.state;
		onClick(null, null);
		if (value !== children) {
			// only save value if it has changed
			let nextValue = value;
			if (value === '' || value === '-') {
				nextValue = 0;
				this.setState({ value: nextValue });
			}

			onChange(row, column, nextValue);
		}
	};

	render() {
		const { active, children, onClick, row, column } = this.props;
		const { value } = this.state;
		return (
			<CellStyled
				onFocus={() => onClick(row, column)}
				onBlur={this.saveChange}
				tabIndex="0"
				role="Gridcell"
				overflow={active ? 'none' : 'hidden'}
				padding={active ? 0 : 10}
			>
				{active ? (
					<Tooltip
						// tooltip can also be made conditionally visible with visible prop
						title="Input Number"
						placement="topLeft"
						trigger={['focus']}
					>
						<div
							css={{
								position: 'absolute',
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
					</Tooltip>
				) : (
					children
				)}
			</CellStyled>
		);
	}
}

NumberCell.propTypes = {
	row: number.isRequired,
	column: string.isRequired,
	onChange: func.isRequired,
	children: any,
	active: bool.isRequired,
	onClick: func.isRequired,
};

export default NumberCell;
