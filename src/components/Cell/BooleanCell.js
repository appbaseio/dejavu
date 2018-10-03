import React from 'react';
import { Dropdown, Icon, Menu, Button } from 'antd';
import { func, number, string, any } from 'prop-types';

const { Item } = Menu;

const BooleanCell = ({ children, onChange, row, column }) => (
	<div
		css={{
			width: 250,
			height: 42,
		}}
	>
		<Dropdown
			trigger={['click']}
			css={{ width: '100%', height: '100%' }}
			overlay={
				<Menu
					onClick={({ key }) => onChange(row, column, key === 'true')}
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
					{String(children)} <Icon type="down" />
				</div>
			</Button>
		</Dropdown>
	</div>
);

BooleanCell.propTypes = {
	row: number.isRequired,
	column: string.isRequired,
	onChange: func.isRequired,
	children: any,
};

export default BooleanCell;
