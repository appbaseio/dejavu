import React from 'react';
import { any } from 'prop-types';
import { Popover, Button } from 'antd';

import CellStyled from './Cell.styles';
import JsonView from '../JsonView';

const ObjectCell = ({ children }) => (
	<CellStyled padding={10} css={{ display: 'flex', alignItems: 'center' }}>
		{children && (
			<Popover content={<JsonView json={children} />} trigger="click">
				<Button shape="circle" icon="ellipsis" />
			</Popover>
		)}
	</CellStyled>
);

ObjectCell.propTypes = {
	children: any,
};

export default ObjectCell;
