import React from 'react';
import { Input } from 'antd';
import { func, number, string, any, bool } from 'prop-types';

import CellStyled from './Cell.styles';

const { TextArea } = Input;

const TextCell = ({ active, children, onChange, onClick, row, column }) => (
	<CellStyled
		onFocus={() => onClick(row, column)}
		onBlur={() => {
			onClick(null, null);
		}}
		tabIndex="0"
		role="Gridcell"
		overflow={active ? 'none' : 'hidden'}
		padding={active ? 0 : 10}
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
			children
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
