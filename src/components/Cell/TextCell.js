// @flow

import React from 'react';
import { Input, Popover } from 'antd';
import { func, any, bool, shape, number, string } from 'prop-types';
import { connect } from 'react-redux';

import CellStyled from './Cell.styles';
import Flex from '../Flex';

import overflowText from '../DataTable/overflow.style';
import { setCellActive } from '../../actions';
import { getActiveCell } from '../../reducers/cell';

type Props = {
	children: [],
	onChange: any => void,
	shouldAutoFocus?: boolean,
	activeCell?: { row: any, column: any },
	setCellActive: (row: any, column: any) => void,
	row: any,
	column: any,
	mode?: string,
	editable?: boolean,
};

const { TextArea } = Input;

const TextCell = ({
	children,
	onChange,
	setCellActive: setCellActiveDispatch,
	activeCell,
	row,
	column,
	mode,
	shouldAutoFocus,
	editable,
}: Props) => (
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
				}}
			>
				<TextArea
					autoFocus={shouldAutoFocus}
					autosize={{
						minRows: 1,
						maxRows: 1,
					}}
					defaultValue={children}
					onBlur={e => {
						const { value } = e.target;
						if (value !== children) {
							// only change value if something was changed
							onChange(value);
						}

						if (typeof row === 'number' && column) {
							setCellActiveDispatch(null, null);
						}
					}}
				/>
			</div>
		) : (
			<Popover
				placement="topLeft"
				content={
					<div
						css={{
							maxWidth: '230px',
							maxHeight: '300px',
							overflow: 'auto',
						}}
					>
						<div>{children}</div>
					</div>
				}
			>
				{children && (
					<Flex
						justifyContent="left"
						alignItems="center"
						css={{
							width: '100%',
							height: '100%',
						}}
					>
						<div
							css={overflowText}
							dangerouslySetInnerHTML={{ __html: children }}
						/>
					</Flex>
				)}
			</Popover>
		)}
	</CellStyled>
);

const mapStateToProps = state => ({
	activeCell: getActiveCell(state),
});

const mapDispatchToProps = {
	setCellActive,
};

TextCell.propTypes = {
	onChange: func.isRequired,
	children: any,
	shouldAutoFocus: bool,
	activeCell: shape({ row: number, column: string }),
	setCellActive: func.isRequired,
	mode: string,
	editable: bool,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(TextCell);
