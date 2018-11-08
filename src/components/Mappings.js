// @flow

import React from 'react';
import { connect } from 'react-redux';

import ErrorFlashMessage from './ErrorFlashMessage';
import ConnectApp from './ConnectApp';
import Mappings from '../batteries/components/Mappings';
import BaseContainer from '../batteries/components/BaseContainer';

import { getIsConnected, getAppname, getUrl } from '../reducers/app';
import { parseUrl } from '../utils';

type Props = {
	isConnected: boolean,
	appName?: string,
	rawUrl?: string,
};

const MappingsPage = ({ isConnected, appName, rawUrl }: Props) => {
	const { credentials, url } = parseUrl(rawUrl);
	return (
		<section css={{ marginRight: '25px' }}>
			<ErrorFlashMessage />
			{!isConnected ? (
				<ConnectApp />
			) : (
				<BaseContainer
					appName={appName}
					shouldFetchAppPlan={false}
					shouldFetchAppInfo={false}
				>
					<Mappings
						appName={appName}
						credentials={credentials}
						url={url}
					/>
				</BaseContainer>
			)}
		</section>
	);
};

const mapStateToProps = state => ({
	isConnected: getIsConnected(state),
	appName: getAppname(state),
	rawUrl: getUrl(state),
});

export default connect(mapStateToProps)(MappingsPage);
