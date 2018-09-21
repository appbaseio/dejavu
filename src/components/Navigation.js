import React from 'react';
import { Menu, Icon } from 'antd';
import { withRouter } from 'react-router-dom';
import { object } from 'prop-types';

const { Item } = Menu;

const Navigation = ({ history }) => (
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
