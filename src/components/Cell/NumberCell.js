// @flow

import React, { Component } from 'react';
import { InputNumber } from 'antd';
import { func, any, bool } from 'prop-types';
import { connect } from 'react-redux';

import CellStyled from './Cell.styles';

import { setCellActive } from '../../actions';
import { getActiveCell } from '../../reducers/cell';

type Props = {
	children: any,
	onChange: func,
	shouldAutoFocus?: boolean,
	activeCell?: { row: any, column: any },
	setCellActive: (row: any, column: any) => void,
	row: any,
	column: any,
	mode?: string,
	editable?: boolean,
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
		const {
			onChange,
			children,
			setCellActive: setCellActiveDispatch,
			row,
			column,
		} = this.props;
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

		if (typeof row === 'number' && column) {
			setCellActiveDispatch(null, null);
		}
	};

	render() {
		const {
			children,
			setCellActive: setCellActiveDispatch,
			activeCell,
			row,
			column,
			mode,
			shouldAutoFocus,
			editable,
		} = this.props;
		const { value } = this.state;
		return (
			<CellStyled
				tabIndex="0"
				role="Gridcell"
				onFocus={() => {
					if (typeof row === 'number' && column) {
						setCellActiveDispatch(row, column);
					}
				}}
			>
				{editable ||
				(mode === 'edit' &&
					activeCell &&
					activeCell.row === row &&
					activeCell.column === column) ? (
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

const mapStateToProps = state => ({
	activeCell: getActiveCell(state),
});

const mapDispatchToProps = {
	setCellActive,
};

NumberCell.propTypes = {
	onChange: func.isRequired,
	children: any,
	shouldAutoFocus: bool,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(NumberCell);
