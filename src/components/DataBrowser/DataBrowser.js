// @flow

import React from 'react';
import { ReactiveBase, ReactiveList } from '@appbaseio/reactivesearch';
import { Skeleton } from 'antd';
import { connect } from 'react-redux';
import { string, bool } from 'prop-types';

import DataTable from '../DataTable';

import {
	getAppname,
	getUrl,
	getIsLoading,
	getIsConnected,
	getError,
} from '../../reducers/app';
import { parseUrl } from '../../utils';

type Props = {
	appname: string,
	url: string,
	isConnected: boolean,
	isLoading: boolean,
};

const DataBrowser = ({
	appname,
	url: rawUrl,
	isConnected,
	isLoading,
}: Props) => {
	const { credentials, url } = parseUrl(rawUrl);
	return (
		<Skeleton loading={isLoading} active>
			{isConnected && (
				<ReactiveBase app={appname} credentials={credentials} url={url}>
					<ReactiveList
						componentId="results"
						dataField="_id"
						pagination
						onAllData={data => <DataTable data={data} />}
					/>
				</ReactiveBase>
			)}
		</Skeleton>
	);
};

const mapStateToProps = state => ({
	appname: getAppname(state),
	url: getUrl(state),
	isConnected: getIsConnected(state),
	isLoading: getIsLoading(state),
	error: getError(state),
});

DataBrowser.propTypes = {
	appname: string,
	url: string,
	isLoading: bool.isRequired,
	isConnected: bool.isRequired,
};

export default connect(mapStateToProps)(DataBrowser);
