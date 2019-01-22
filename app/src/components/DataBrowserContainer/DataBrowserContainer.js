// @flow

import React from 'react';
import { Skeleton } from 'antd';
import { connect } from 'react-redux';
import { bool, string } from 'prop-types';

import DataBrowser from '../DataBrowser';

import { getIsLoading, getIsConnected } from '../../reducers/app';

type Props = {
	isConnected: boolean,
	isLoading: boolean,
	searchTerm: string,
};

const DataBrowserContainer = ({
	isConnected,
	isLoading,
	searchTerm,
}: Props) => (
	<Skeleton loading={isLoading} active>
		{isConnected && <DataBrowser searchTerm={searchTerm} />}
	</Skeleton>
);

const mapStateToProps = state => ({
	isConnected: getIsConnected(state),
	isLoading: getIsLoading(state),
});

DataBrowserContainer.propTypes = {
	isLoading: bool.isRequired,
	isConnected: bool.isRequired,
	searchTerm: string.isRequired,
};

export default connect(mapStateToProps)(DataBrowserContainer);
