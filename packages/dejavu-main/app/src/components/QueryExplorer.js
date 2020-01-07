// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	FlashMessage as ErrorFlashMessage,
	ConnectApp,
	appReducers,
} from '@appbaseio/dejavu-browser';

const { getIsConnected, getAppname, getUrl } = appReducers;

const LZMA = require('lzma/src/lzma-c');
require('urlsafe-base64/app.js');

type Props = {
	isConnected: boolean,
	appname?: string,
	rawUrl?: string,
};

type State = {
	isProcessingUrl: boolean,
	url: string,
};

class QueryExplorer extends Component<Props, State> {
	state = {
		isProcessingUrl: false,
		url: '',
	};

	componentDidMount() {
		this.processUrl();
	}

	componentDidUpdate(nextProps) {
		if (nextProps.rawUrl !== this.props.rawUrl) {
			this.processUrl();
		}
	}

	processUrl = () => {
		const { rawUrl, appname } = this.props;
		if (rawUrl) {
			this.setState({
				isProcessingUrl: true,
			});
			const connectionString = JSON.stringify({
				url: rawUrl,
				appname,
			});
			LZMA.LZMA_WORKER.compress(connectionString, 9, url => {
				const res = window.SafeEncode.encode(
					window.SafeEncode.buffer(url),
				);
				this.setState({
					isProcessingUrl: false,
					url: res,
				});
			});
		}
	};

	render() {
		const { isConnected } = this.props;
		const { url, isProcessingUrl } = this.state;

		return (
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
				{isConnected && !isProcessingUrl && url && (
					<iframe
						title="Importer"
						src={`https://opensource.appbase.io/mirage/#?input_state=${url}&hf=false&subscribe=false`}
						frameBorder="0"
						width="100%"
						style={{
							height: '80vh',
						}}
					/>
				)}
			</section>
		);
	}
}

const mapStateToProps = state => ({
	isConnected: getIsConnected(state),
	appname: getAppname(state),
	rawUrl: getUrl(state),
});

export default connect(mapStateToProps)(QueryExplorer);
