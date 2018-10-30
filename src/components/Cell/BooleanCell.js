// @flow

import React from 'react';
import { Dropdown, Icon, Menu, Button } from 'antd';
import { func, string, any } from 'prop-types';

import CellStyled from './Cell.styles';

const { Item } = Menu;

type Props = {
	children: boolean,
	onChange: func,
	mode: string,
};

const BooleanCell = ({ children, onChange, mode }: Props) => (
	<CellStyled>
		{mode === 'edit' ? (
			<Dropdown
				trigger={['click']}
				css={{
					width: '100%',
					height: '100%',
					borderColor: 'transparent',
				}}
				overlay={
					<Menu
						onClick={({ key }) => onChange(Boolean(key === 'true'))}
					>
						<Item key="true">
							<Icon type="check-circle" />
							true
						</Item>
						<Item key="false">
							<Icon type="close-circle" />
							false
						</Item>
					</Menu>
				}
			>
				<Button>
					<div
						css={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						{children !== undefined
							? String(children)
							: 'Select a Value'}
						<Icon type="down" />
					</div>
				</Button>
			</Dropdown>
		) : (
			children
		)}
	</CellStyled>
);

BooleanCell.propTypes = {
	onChange: func.isRequired,
	children: any,
	mode: string,
};

export default BooleanCell;
