// @flow

import React from 'react';
import { Menu, Icon } from 'antd';
import { withRouter } from 'react-router-dom';
import { object } from 'prop-types';

type Props = {
	history: object,
};

const { Item } = Menu;

const Navigation = ({ history }: Props) => (
	<Menu
		defaultSelectedKeys={['browse']}
		mode="inline"
		onSelect={({ key }) => history.push(key === 'browse' ? '/' : key)}
	>
		<Item key="browse">
			<Icon type="table" />
			Data Browser
		</Item>
		<Item key="import">
			<Icon type="upload" />
			Import
		</Item>
		<Item key="preview">
			<Icon type="search" />
			Search Preview
		</Item>
		<Item key="mappings">
			<Icon type="sliders" />
			Mappings
		</Item>
	</Menu>
);

Navigation.propTypes = {
	history: object.isRequired,
};

export default withRouter(Navigation);
