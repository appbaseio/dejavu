import React from 'react';
import { ReactiveBase, ReactiveList } from '@appbaseio/reactivesearch';
import { Skeleton } from 'antd';
import { connect } from 'react-redux';

import ConnectApp from './ConnectApp';
import DataTable from './DataTable';

import {
	getAppname,
	getUrl,
	getIsLoading,
	getIsConnected,
	getError,
} from '../reducers/app';

const DataBrowser = () => (
	<ReactiveBase
		app="good-books-ds"
		credentials="nY6NNTZZ6:27b76b9f-18ea-456c-bc5e-3a5263ebc63d"
	>
		<ConnectApp />
		<ReactiveList
			componentId="results"
			dataField="_id"
			pagination
			onAllData={data => <DataTable data={data} />}
		/>
	</ReactiveBase>
);

const mapStateToProps = state => ({
	appname: getAppname(state),
	url: getUrl(state),
	isConnected: getIsConnected(state),
	isLoading: getIsLoading(state),
	error: getError(state),
});

export default connect(mapStateToProps)(DataBrowser);
