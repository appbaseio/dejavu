// @flow

import React, { useState, useEffect } from 'react';
import {
	ExperimentOutlined,
	SearchOutlined,
	TableOutlined,
	UploadOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
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
				<TableOutlined />
				<span>Data Browser</span>
			</Item>
			<Item key="import">
				<UploadOutlined />
				<span>Import Data</span>
			</Item>
			{(indexes.length <= 1 || !isConnected) && (
				<Item key="query">
					<SearchOutlined />
					<span>Query Explorer</span>
				</Item>
			)}
			{(indexes.length <= 1 || !isConnected) && (
				<Item key="preview">
					<ExperimentOutlined />
					<span>Search Preview</span>
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
