// @flow

import React from 'react';
import { Menu, Icon } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getIndexes } from '../reducers/mappings';
import { getIsConnected } from '../reducers/app';
import { normalizeSearchQuery } from '../utils';

type Props = {
	indexes: string[],
	isConnected: boolean,
};

const { Item } = Menu;

const getImporterSearchParams = () => {
	let params = window.location.search;

	if (params) {
		params = normalizeSearchQuery(params);
		params += '&sidebar=true';
	} else {
		params = '?sidebar=true';
	}

	return params;
};
const Navigation = ({ indexes, isConnected }: Props) => {
	const routeName = window.location.pathname.substring(1);
	let defaultSelectedKey = routeName;

	if (!routeName) {
		defaultSelectedKey = 'browse';
	}

	return (
		<Menu defaultSelectedKeys={[defaultSelectedKey]} mode="inline">
			<Item key="browse">
				<Link to="/">
					<Icon type="table" />
					Data Browser
				</Link>
			</Item>
			<Item key="import">
				<a href={`./importer/${getImporterSearchParams()}`}>
					<Icon type="upload" />
					Import Data
				</a>
			</Item>
			{(indexes.length <= 1 || !isConnected) && (
				<Item key="query">
					<Link to="/query">
						<Icon type="search" />
						Query Explorer
					</Link>
				</Item>
			)}
			{(indexes.length <= 1 || !isConnected) && (
				<Item key="preview">
					<Link to="/preview">
						<Icon type="experiment" />
						Search Preview
					</Link>
				</Item>
			)}
		</Menu>
	);
};

const mapStateToProps = state => ({
	indexes: getIndexes(state),
	isConnected: getIsConnected(state),
});

export default connect(mapStateToProps)(Navigation);
