// @flow

import React from 'react';
import { connect } from 'react-redux';

import ErrorFlashMessage from './ErrorFlashMessage';
import ConnectApp from './ConnectApp';

import { getIsConnected, getAppname, getUrl } from '../reducers/app';
import { getImporterLink } from '../utils';

type Props = {
	isConnected: boolean,
	rawUrl?: string,
	appname?: string,
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
				src={getImporterLink(appname, rawUrl)}
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
