// @flow

import React from 'react';
import { connect } from 'react-redux';

import ErrorFlashMessage from './ErrorFlashMessage';
import ConnectApp from './ConnectApp';
import SearchSandbox from '../batteries/components/SearchSandbox';
import BaseContainer from '../batteries/components/BaseContainer';
import Editor from '../batteries/components/SearchSandbox/containers/AceEditor';

import { getIsConnected, getAppname, getUrl } from '../reducers/app';
import { parseUrl } from '../utils';

type Props = {
	isConnected: boolean,
	appName?: string,
	rawUrl?: string,
};

const SearchPreview = ({ isConnected, appName, rawUrl }: Props) => {
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
					<SearchSandbox
						appName={appName}
						credentials={credentials}
						url={url}
					>
						<Editor mappingsURL="https://opensource.appbase.io/dejavu/mappings" />
					</SearchSandbox>
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

export default connect(mapStateToProps)(SearchPreview);
