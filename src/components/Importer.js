// @flow

import React from 'react';
import { connect } from 'react-redux';

import ErrorFlashMessage from './ErrorFlashMessage';
import ConnectApp from './ConnectApp';

import { getIsConnected, getAppname, getUrl } from '../reducers/app';
import { parseUrl } from '../utils';

type Props = {
	isConnected: boolean,
	rawUrl?: string,
	appname?: string,
};

const getLinkParams = (appname, rawUrl) => {
	let params = `?header=false`;
	if (rawUrl.indexOf('appbase.io') > 1) {
		const { credentials } = parseUrl(rawUrl);
		params += `&app={"platform":"appbase","appname":"${appname}","credentials":"${credentials}"}`;
	} else {
		params += `&app={"platform":"elasticsearch","appname":"${appname}","hosturl":"${rawUrl}"}`;
	}

	return params;
};

const Importer = ({ isConnected, rawUrl = '', appname = '' }: Props) => (
	<section
		css={{
			'.ui-layout-pane': {
				borderRadius: '3px',
				borderColor: '#eee',
			},
		}}
	>
		<ErrorFlashMessage />
		<ConnectApp />
		<br />
		{isConnected && (
			<iframe
				title="Importer"
				src={`https://importer.appbase.io/${getLinkParams(
					appname,
					rawUrl,
				)}`}
				frameBorder="0"
				width="100%"
				style={{
					height: '80vh',
				}}
			/>
		)}
	</section>
);

const mapStateToProps = state => ({
	isConnected: getIsConnected(state),
	appname: getAppname(state),
	rawUrl: getUrl(state),
});

export default connect(mapStateToProps)(Importer);
