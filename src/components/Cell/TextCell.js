// @flow

import React from 'react';
import { Input, Popover } from 'antd';
import { func, number, string, any, bool } from 'prop-types';

import CellStyled from './Cell.styles';

type Props = {
	children: [],
	onChange: (number, string, any) => void,
	onClick: (any, any) => void,
	row: number,
	column: string,
	active: boolean,
};

const { TextArea } = Input;

const TextCell = ({
	active,
	children,
	onChange,
	onClick,
	row,
	column,
}: Props) => (
	<CellStyled
		onFocus={() => onClick(row, column)}
		onBlur={() => {
			onClick(null, null);
		}}
		tabIndex="0"
		role="Gridcell"
	>
		{active ? (
			<div
				css={{
					position: 'absolute',
					width: '100%',
				}}
			>
				<TextArea
					autoFocus
					autosize={{
						minRows: 1,
						maxRows: 1,
					}}
					defaultValue={children}
					onBlur={e => {
						const { value } = e.target;
						if (value !== children) {
							// only change value if something was changed
							onChange(row, column, value);
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
				{children}
			</Popover>
		)}
	</CellStyled>
);

TextCell.propTypes = {
	row: number.isRequired,
	column: string.isRequired,
	onChange: func.isRequired,
	children: any,
	active: bool.isRequired,
	onClick: func.isRequired,
};

export default TextCell;
