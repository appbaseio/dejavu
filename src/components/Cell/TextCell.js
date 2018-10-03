import React from 'react';
import { Input } from 'antd';
import { func, number, string, any, bool } from 'prop-types';

const { TextArea } = Input;

const TextCell = ({ active, children, onChange, onFocus, row, column }) => (
	<div
		onFocus={() => onFocus(row, column)}
		onBlur={() => {
			onFocus(null, null);
		}}
		tabIndex="0"
		role="Gridcell"
		css={{
			width: 250,
			height: 42,
			overflow: active ? 'none' : 'hidden',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
			padding: active ? 0 : 10,
			outline: 'none',
			position: 'relative',
		}}
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
						minRows: 2,
						maxRows: 2,
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
	</div>
);

TextCell.propTypes = {
	row: number.isRequired,
	column: string.isRequired,
	onChange: func.isRequired,
	children: any,
	active: bool.isRequired,
	onFocus: func.isRequired,
};

export default TextCell;
