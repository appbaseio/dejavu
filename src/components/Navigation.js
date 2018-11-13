// @flow

import React from 'react';
import { Menu, Icon } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { object } from 'prop-types';

import { getIndexes } from '../reducers/mappings';
import { getIsConnected } from '../reducers/app';

type Props = {
	history: object,
	indexes: string[],
	isConnected: boolean,
};

const { Item } = Menu;

const Navigation = ({ history, indexes, isConnected }: Props) => {
	const routeName = window.location.pathname.substring(1);
	let defaultSelectedKey = routeName;

	if (!routeName) {
		defaultSelectedKey = 'browse';
	}

	return (
		<Menu
			defaultSelectedKeys={[defaultSelectedKey]}
			mode="inline"
			onSelect={({ key }) => history.push(key === 'browse' ? '/' : key)}
			css={{
				borderRight: 0,
			}}
		>
			<Item key="browse">
				<Icon type="table" />
				Data Browser
			</Item>
			<Item key="import">
				<Icon type="upload" />
				Import
			</Item>
			{(indexes.length <= 1 || !isConnected) && (
				<Item key="preview">
					<Icon type="search" />
					Search Preview
				</Item>
			)}
			{(indexes.length <= 1 || !isConnected) && (
				<Item key="mappings">
					<Icon type="sliders" />
					Mappings
				</Item>
			)}
		</Menu>
	);
};

Navigation.propTypes = {
	history: object.isRequired,
};

const mapStateToProps = state => ({
	indexes: getIndexes(state),
	isConnected: getIsConnected(state),
});

export default connect(mapStateToProps)(withRouter(Navigation));
