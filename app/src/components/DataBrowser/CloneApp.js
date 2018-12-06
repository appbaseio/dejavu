// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';

import { getIsConnected, getAppname, getUrl } from '../../reducers/app';
import { getImporterLink, getUrlParams } from '../../utils';

type Props = {
	isConnected: boolean,
	rawUrl?: string,
	appname?: string,
};

const CloneApp = ({ appname, rawUrl, isConnected }: Props) => {
	const { cloneApp } = getUrlParams(window.location.search);
	let isVisible = true;

	if (cloneApp && cloneApp === 'false') {
		isVisible = false;
	}
	return (
		isConnected &&
		isVisible && (
			<Button
				icon="fork"
				type="primary"
				target="_blank"
				href={getImporterLink(appname, rawUrl)}
				css={{ marginRight: 10 }}
			>
				{' '}
				Clone This App
			</Button>
		)
	);
};
const mapStateToProps = state => ({
	isConnected: getIsConnected(state),
	appname: getAppname(state),
	rawUrl: getUrl(state),
});

export default connect(mapStateToProps)(CloneApp);
