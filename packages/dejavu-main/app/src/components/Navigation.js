// @flow

import React, { useState, useEffect } from 'react';
import { Menu, Icon } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
	mappingsReducers,
	appReducers,
	utils,
} from '@appbaseio/dejavu-browser';

const { getIndexes } = mappingsReducers;
const { getIsConnected } = appReducers;
const { getUrlParams, isExtension } = utils;

type Props = {
	indexes: string[],
	isConnected: boolean,
	history: any,
};

const { Item } = Menu;

const Navigation = ({ indexes, isConnected, history }: Props) => {
	const [selectedKey, setSelectedKey] = useState('browse');

	useEffect(() => {
		const routeName = window.location.pathname.substring(1);
		setSelectedKey(routeName);
	}, []);

	const navHandler = key => {
		switch (key) {
			case 'import':
				window.open('https://importer.appbase.io/', '_blank');
				break;
			case 'browse':
				setSelectedKey('browse');
				history.push('/');
				break;
			default:
				setSelectedKey(key);
				history.push(key);
				break;
		}
	};

	// special case for chrome extension
	if (isExtension()) {
		const { route } = getUrlParams(window.location.search);
		if (route) {
			setSelectedKey(route);
		} else {
			setSelectedKey('browse');
		}
	}
	return (
		<Menu
			selectedKeys={[selectedKey]}
			mode="inline"
			onClick={({ key }) => navHandler(key)}
		>
			<Item key="browse">
				<Icon type="table" />
				Data Browser
			</Item>
			<Item key="import">
				<Icon type="upload" />
				Import Data
			</Item>
			{(indexes.length <= 1 || !isConnected) && (
				<Item key="query">
					<Icon type="search" />
					Query Explorer
				</Item>
			)}
			{(indexes.length <= 1 || !isConnected) && (
				<Item key="preview">
					<Icon type="experiment" />
					Search Preview
				</Item>
			)}
		</Menu>
	);
};

const mapStateToProps = state => ({
	indexes: getIndexes(state),
	isConnected: getIsConnected(state),
});

export default connect(mapStateToProps)(withRouter(Navigation));
