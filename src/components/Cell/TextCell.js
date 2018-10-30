// @flow

import React from 'react';
import { Input, Popover } from 'antd';
import { func, any, bool } from 'prop-types';

import CellStyled from './Cell.styles';

type Props = {
	children: [],
	onChange: any => void,
	active: boolean,
};

const { TextArea } = Input;

const TextCell = ({ active, children, onChange }: Props) => (
	<CellStyled>
		{active ? (
			<div
				css={{
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
						e.stopPropagation();
						const { value } = e.target;
						if (value !== children) {
							// only change value if something was changed
							onChange(value);
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
	onChange: func.isRequired,
	children: any,
	active: bool.isRequired,
};

export default TextCell;
