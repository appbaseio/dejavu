// @flow

import React from 'react';
import { connect } from 'react-redux';

import ErrorFlashMessage from './ErrorFlashMessage';
import ConnectApp from './ConnectApp';

import { getIsConnected, getAppname, getUrl } from '../reducers/app';

type Props = {
	isConnected: boolean,
	rawUrl?: string,
};

const QueryExplorer = ({ isConnected, rawUrl = '' }: Props) => (
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
				src={`https://opensource.appbase.io/mirage/#?input_state=${rawUrl}&hf=false&subscribe=false`}
				frameBorder="0"
				width="100%"
				style={{
					height: '75vh',
				}}
			/>
		)}
	</section>
);

const mapStateToProps = state => ({
	isConnected: getIsConnected(state),
	appName: getAppname(state),
	rawUrl: getUrl(state),
});

export default connect(mapStateToProps)(QueryExplorer);
