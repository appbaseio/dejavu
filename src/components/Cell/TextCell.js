// @flow

import React from 'react';
import { Input, Popover } from 'antd';
import { func, any, bool } from 'prop-types';

import CellStyled from './Cell.styles';
import Flex from '../Flex';

type Props = {
	children: [],
	onChange: any => void,
	active: boolean,
	handleFocus?: any => void,
	handleBlur?: any => void,
	shouldAutoFocus?: boolean,
};

const { TextArea } = Input;

const TextCell = ({
	active,
	children,
	onChange,
	handleFocus,
	handleBlur,
	shouldAutoFocus,
}: Props) => (
	<CellStyled tabIndex="0" role="Gridcell" onFocus={handleFocus}>
		{active ? (
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

						if (handleBlur) {
							handleBlur(e);
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
							css={{
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
								width: '100%',
							}}
							dangerouslySetInnerHTML={{ __html: children }}
						/>
					</Flex>
				)}
			</Popover>
		)}
	</CellStyled>
);

TextCell.propTypes = {
	onChange: func.isRequired,
	children: any,
	active: bool.isRequired,
	handleFocus: func,
	handleBlur: func,
	shouldAutoFocus: bool,
};

export default TextCell;
