// @flow

import React, { Fragment } from 'react';
import { Input, Popover } from 'antd';
import { func, any, bool, string } from 'prop-types';

import CellStyled from './Cell.styles';
import Flex from '../Flex';

import overflowText from '../DataTable/overflow.style';

type Props = {
	children: [],
	onChange: any => void,
	shouldAutoFocus?: boolean,
	mode?: string,
	editable?: boolean,
};

const TextCell = ({
	children,
	onChange,
	mode,
	shouldAutoFocus,
	editable,
}: Props) => (
	<Fragment>
		{editable || mode === 'edit' ? (
			<Input
				autosize={{
					minRows: 1,
					maxRows: 1,
				}}
				tabIndex="0"
				role="Gridcell"
				defaultValue={children}
				onBlur={e => {
					const { value } = e.target;
					const child = children || '';

					if (value !== child) {
						onChange(value);
					}
				}}
				css={{
					height: '100% important',
					width: '100%',
					border: `${shouldAutoFocus ? 'none' : 'auto'}`,
				}}
			/>
		) : (
			<CellStyled>
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
			</CellStyled>
		)}
	</Fragment>
);
TextCell.propTypes = {
	onChange: func.isRequired,
	children: any,
	shouldAutoFocus: bool,
	mode: string,
	editable: bool,
};

export default TextCell;
