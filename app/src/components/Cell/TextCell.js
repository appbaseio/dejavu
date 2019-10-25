// @flow

import React, { Fragment } from 'react';
import { Input, Popover } from 'antd';
import { func, any, bool, string } from 'prop-types';

import CellStyled from './Cell.styles';
import overflowText from '../DataTable/overflow.style';
import { MODES } from '../../constants';
import popoverContent from '../CommonStyles/popoverContent';

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
		{editable || mode === MODES.EDIT ? (
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
					onChange(value);
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
					trigger="click"
					content={
						<div css={popoverContent}>
							<div
								css={{ cursor: 'pointer' }}
								dangerouslySetInnerHTML={{ __html: children }}
							/>
						</div>
					}
				>
					{children && (
						<div
							css={{
								...overflowText,
								cursor: 'pointer',
								height: mode === MODES.EDIT ? 45 : 30,
								lineHeight:
									mode === MODES.EDIT ? '45px' : '30px',
							}}
						>
							{children}
						</div>
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
